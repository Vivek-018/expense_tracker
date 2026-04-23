import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Expense } from '@/models/Expense';
import { CreateExpenseSchema } from '@/lib/validations';
import { formatAmount, toDTO } from '@/lib/format';

// GET /api/expenses?category=Food&sort=date_desc
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');

    const filter: Record<string, unknown> = {};
    if (category && category !== 'all') filter.category = category;

    const sortOrder = sort === 'date_desc' ? { date: -1 } : { date: -1 }; // always newest first

    const expenses = await Expense.find(filter)
      .sort(sortOrder as any)
      .lean();

    return NextResponse.json({ data: expenses.map(toDTO) });
  } catch (err) {
    console.error('[GET /api/expenses]', err);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

// POST /api/expenses  (idempotent via clientId)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = CreateExpenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { clientId, amount, category, description, date } = parsed.data;

    // Idempotency: if clientId already exists, return existing record
    const existing = await Expense.findOne({ clientId }).lean();
    if (existing) {
      return NextResponse.json({ data: toDTO(existing), idempotent: true });
    }

    // Convert to paise (integer) — avoid float math entirely
    const amountPaise = Math.round(amount * 100);

    const expense = await Expense.create({
      clientId,
      amountPaise,
      category,
      description,
      date: new Date(date),
    });

    return NextResponse.json({ data: toDTO(expense.toObject()) }, { status: 201 });
  } catch (err: any) {
    // MongoDB duplicate key (race condition on clientId)
    if (err.code === 11000) {
      const existing = await Expense.findOne({ clientId: err.keyValue?.clientId }).lean();
      return NextResponse.json({ data: toDTO(existing!), idempotent: true });
    }
    console.error('[POST /api/expenses]', err);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
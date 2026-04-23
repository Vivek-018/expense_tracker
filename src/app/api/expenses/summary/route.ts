import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Expense } from '@/models/Expense';

export async function GET() {
  try {
    await connectDB();

    const summary = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          totalPaise: { $sum: '$amountPaise' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalPaise: -1 } },
    ]);

    const data = summary.map(item => ({
      category:     item._id,
      totalPaise:   item.totalPaise,
      totalDisplay: `₹${(item.totalPaise / 100).toFixed(2)}`,
      count:        item.count,
    }));

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[GET /api/expenses/summary]', err);
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
  }
}
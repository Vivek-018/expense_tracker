import { IExpense } from '@/models/Expense';
import { ExpenseDTO } from '@/types/expense';

export function toDTO(doc: any): ExpenseDTO {
  return {
    _id:           doc._id.toString(),
    amountPaise:   doc.amountPaise,
    amountDisplay: formatAmount(doc.amountPaise),
    category:      doc.category,
    description:   doc.description,
    date:          doc.date.toISOString().split('T')[0],
    createdAt:     doc.createdAt.toISOString(),
  };
}

export function formatAmount(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}
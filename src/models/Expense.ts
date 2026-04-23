import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExpense extends Document {
  clientId: string; // Idempotency key (UUID from client)
  amountPaise: number; // Store as integer paise (₹1 = 100 paise)
  category: string;
  description: string;
  date: Date; // User-selected date (not server time)
  createdAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    clientId: { type: String, required: true, unique: true, index: true },
    amountPaise: { type: Number, required: true, min: 1 },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
  },
  { timestamps: true },
);

// Compound index for efficient category filter + date sort
ExpenseSchema.index({ category: 1, date: -1 });

export const Expense: Model<IExpense> =
  mongoose.models.Expense ?? mongoose.model("Expense", ExpenseSchema);

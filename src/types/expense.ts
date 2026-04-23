export interface ExpenseDTO {
  _id: string;
  amountPaise: number;      // Raw integer for calculations
  amountDisplay: string;    // Formatted "₹123.45"
  category: string;
  description: string;
  date: string;             // ISO string
  createdAt: string;
}
import { z } from 'zod';

export const CreateExpenseSchema = z.object({
  clientId:    z.string().uuid(),
  amount:      z.number().positive('Amount must be positive').max(10_000_000),
  category:    z.string().min(1).max(100).trim(),
  description: z.string().min(1).max(500).trim(),
  date:        z.string().date(), // "YYYY-MM-DD"
});

export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>;
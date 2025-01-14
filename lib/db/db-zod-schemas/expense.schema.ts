import { z } from 'zod';

export const DBExpenseSchema = z
  .object({
    id: z.string(),
    amount: z.number().int(),
    title: z.string(),
    payerAccount: z.string(),
    beneficiaryAccount: z.string(),
    beneficiaryAddress: z.string(),
    scheduledAt: z.string().datetime({ offset: true }),
  })
  .strict();

export type DBExpense = z.infer<typeof DBExpenseSchema>;

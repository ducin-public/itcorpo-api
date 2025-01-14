import { z } from 'zod';

export const DBDepartmentSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
  })
  .strict();

export type DBDepartment = z.infer<typeof DBDepartmentSchema>;

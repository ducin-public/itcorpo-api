import { z } from 'zod';

export const DBNationalitySchema = z.enum(["US", "UK", "FR", "DE", "NL", "PL", "IT", "ES"]);
export type DBNationality = z.infer<typeof DBNationalitySchema>;

export const DBContractTypeSchema = z.enum(["CONTRACT", "PERMANENT"]);
export type DBContractType = z.infer<typeof DBContractTypeSchema>;

export const DBEmployeeSchema = z
  .object({
    id: z.number().int(),
    nationality: DBNationalitySchema,
    department: z.string(),
    keycardId: z.string(),
    account: z.string(),
    salary: z.number().int(),
    office: z.array(z.string()).min(2).max(2),
    firstName: z.string(),
    lastName: z.string(),
    title: z.string(),
    contractType: DBContractTypeSchema,
    email: z.string().email(),
    hiredAt: z.string().datetime({ offset: true }),
    expiresAt: z.string().datetime({ offset: true }),
    personalInfo: z
      .object({
        age: z.number().int().gte(0),
        phone: z.string(),
        email: z.string().email(),
        dateOfBirth: z.string().datetime({ offset: true }),
        address: z
          .object({ street: z.string(), city: z.string(), country: z.string() })
          .strict(),
      })
      .strict(),
    skills: z.array(z.string()),
    bio: z.string(),
    imgURL: z.string().optional(),
  })
  .strict();

export type DBEmployee = z.infer<typeof DBEmployeeSchema>;

import { z } from 'zod';

export const DBNationalitySchema = z.enum(["US", "UK", "FR", "DE", "NL", "PL", "IT", "ES", "IN"]);
export type DBNationality = z.infer<typeof DBNationalitySchema>;

export const DBContractTypeSchema = z.enum(["CONTRACT", "PERMANENT"]);
export type DBContractType = z.infer<typeof DBContractTypeSchema>;

// const DateString = z.string().datetime({ offset: true });
const DateString = z.string();

export const DBEmployeeSchema = z
  .object({
    id: z.number().int(),
    nationality: DBNationalitySchema,
    departmentId: z.number(),
    keycardId: z.string(),
    account: z.string(),
    officeCode: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    position: z.string(),
    email: z.string().email(),
    skills: z.array(z.string()),
    bio: z.string(),
    imgURL: z.string().optional(),
    employment: z.object({
      contractType: DBContractTypeSchema,
      currentSalary: z.number().int(),
      startDate: DateString,
      endDate: DateString.optional(),
    }),
    personalInfo: z
      .object({
        phone: z.string(),
        email: z.string().email(),
        dateOfBirth: DateString,
        address: z
          .object({ street: z.string(), city: z.string(), country: z.string() })
          .strict(),
      })
      .strict(),
  })
  .strict();

export type DBEmployee = z.infer<typeof DBEmployeeSchema>;

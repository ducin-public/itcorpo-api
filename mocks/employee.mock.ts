import { DBEmployee } from "../lib/db/db-zod-schemas/employee.schema";
import { DeepPartial } from "../lib/types";

const defaultEmployee: DBEmployee = {
  "id": 91720,
  "nationality": "PL",
  "departmentId": 4,
  "keycardId": "52122b5f-2a8b-4506-b880-aac5e86d7d72",
  "account": "PL92 0200 9442 0911 9006 6507 9046",
  "officeCode": "pl-lublin",
  "firstName": "Bertram",
  "lastName": "Kruszewski",
  "position": "Junior .Net Engineer",
  "email": "Bertram66@itcorpo.com",
  "skills": [
    "DDD",
    "MVC",
    "data structures",
    "algorithms",
    "scrum",
    "testing"
  ],
  "bio": "Aliquid et consequatur est explicabo et suscipit.\nNumquam dicta nihil rem.\nDoloribus inventore molestiae voluptates dolorum repellat architecto exercitationem unde tempora.\nAlias cum nulla ea maiores commodi odit praesentium eum omnis.\nUt consequatur ut.\n \rId et consequatur minus a.\nUllam repellat laudantium voluptatem est veritatis et qui deleniti.\nItaque eum minus voluptas ut.\nTempore praesentium voluptas et.\nVoluptas voluptatem ducimus voluptates ut.\nMagnam laborum maxime expedita veniam atque quo ducimus animi.\n \rCupiditate aspernatur odio officia nulla rerum.\nRem quod doloremque nisi in suscipit vitae eligendi.\nVel deserunt hic ratione itaque ab ipsum qui cupiditate voluptas.\nSunt pariatur quia ut.",
  "imgURL": "nurse-white-male.png",
  "employment": {
    "contractType": "CONTRACT",
    "currentSalary": 9628,
    "startDate": "2007-08-14",
    "endDate": "2018-06-20"
  },
  "personalInfo": {
    "phone": "1-390-798-9734 x32319",
    "email": "Bertram.Kruszewski@gmail.com",
    "dateOfBirth": "1967-09-06",
    "address": {
      "street": "5222 Orin Inlet",
      "city": "Colleen port",
      "country": "Sri Lanka"
    },
  },
};

/**
 * Creates a mock employee object with provided overrides.
 * It has all the required properties of an employee object.
 * 
 * @example
 * ```ts
 * mockEmployee({ firstName: 'John', lastName: 'Doe' });
 * ```
 * 
 * @param overrides - partial employee object to override default values
 * @returns Employee
 */
export const mockEmployee = (overrides: DeepPartial<DBEmployee>): DBEmployee => {
  const { personalInfo, employment, ...restEmployee } = overrides
  const { address, ...restPersonalInfo } = personalInfo || {}

  return {
    ...defaultEmployee,
    employment: {
      ...defaultEmployee.employment,
      ...employment
    },
    personalInfo: {
      ...defaultEmployee.personalInfo,
      ...restPersonalInfo,
      address: {
        ...defaultEmployee.personalInfo.address,
        ...address
      }
    },
    ...restEmployee
  }
}

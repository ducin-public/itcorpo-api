import { addMonths, addYears, subMonths, subYears } from 'date-fns';
import { DBEmployee } from '../../lib/db/db-zod-schemas/employee.schema';
import { randomInt } from '../lib/random';

// DON'T REMOVE THESE COMMENTS !!!
// date of birth:
// - nobody should be born before 2003
// - randomize birth date:
//   - 3% of employees will be born between 1960-1970
//   - 7% of employees will be born between 1970-1975
//   - 10% of employees will be born between 1975-1980
//   - 50% of employees will be born between 1980-1990
//   - 20% of employees will be born between 1990-2000
//   - others will be born between 2000-2003
// also, randomize employment startDate and endDate:
// - all were hired no earlier than 2011
// - startDate:
// -   10% of employees will be hired in 1-6 months from now
// -   10% of employees will be hired 1-12 months ago
// -   50% of employees will be hired 1-5 years ago
// -   20% of employees will be hired 5-10 years ago
// -   others will be hired 10+ years ago
// - endDate:
// -   40% of employees won't have endDate
// -   10% of employees will have endDate set to 1-6 months from now
// -   10% of employees will have endDate set to 6-12 months from now
// -   40% of employees will have endDate somewhere in the past - use already generated startDate. Total employment should be somewhere between 1-10 years.
// for employees with endDate, add 10 years to startDate

const getRandomBirthDate = (): Date => {
    const rand = Math.random();

    if (rand < 0.03) return new Date(randomInt(1960, 1970), randomInt(0, 11), randomInt(1, 28));
    if (rand < 0.10) return new Date(randomInt(1970, 1975), randomInt(0, 11), randomInt(1, 28));
    if (rand < 0.20) return new Date(randomInt(1975, 1980), randomInt(0, 11), randomInt(1, 28));
    if (rand < 0.70) return new Date(randomInt(1980, 1990), randomInt(0, 11), randomInt(1, 28));
    if (rand < 0.90) return new Date(randomInt(1990, 2000), randomInt(0, 11), randomInt(1, 28));
    return new Date(randomInt(2000, 2003), randomInt(0, 11), randomInt(1, 28));
};

const getRandomStartDate = (): Date => {
    const rand = Math.random();
    const now = new Date();

    if (rand < 0.10) return addMonths(now, randomInt(1, 6)); // 1-6 months from now
    if (rand < 0.20) return subMonths(now, randomInt(1, 12)); // 1-12 months ago
    if (rand < 0.70) return subYears(now, randomInt(1, 5)); // 1-5 years ago
    if (rand < 0.90) return subYears(now, randomInt(5, 10)); // 5-10 years ago
    return subYears(now, 10); // 10+ years ago
};

const getEmploymentDates = () => {
    let startDate = getRandomStartDate();
    const rand = Math.random();
    const now = new Date();

    // 40% of employees won't have endDate
    if (rand < 0.4) {
        return {
            startDate: startDate.toISOString()
        };
    }

    // 10% will have endDate 1-6 months from now
    if (rand < 0.5) {
        return {
            startDate: startDate.toISOString(),
            endDate: addMonths(now, randomInt(1, 6)).toISOString()
        };
    }

    // 10% will have endDate 6-12 months from now
    if (rand < 0.6) {
        return {
            startDate: startDate.toISOString(),
            endDate: addMonths(now, randomInt(6, 12)).toISOString()
        };
    }

    // 40% will have endDate 1-10 years after their start date
    startDate = subYears(now, randomInt(5, 10));
    const totalEmploymentYears = randomInt(1, 10);
    let endDate = addYears(startDate, totalEmploymentYears);
    if (endDate > now) {
        endDate = subMonths(now, randomInt(1, 6));
    }

    return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
    };
};

export const adjustBirthDate = (personalInfo: DBEmployee['personalInfo']) => {
    return {
        ...personalInfo,
        dateOfBirth: getRandomBirthDate().toISOString()
    };
};

export const updateEmploymentDates = (employment: DBEmployee['employment']) => {
    const dates = getEmploymentDates();
    const result = {
        ...employment,
        ...dates
    };

    if (!dates.endDate) {
        delete result.endDate;
    }

    return result;
};

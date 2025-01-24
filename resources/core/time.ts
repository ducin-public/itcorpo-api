import { differenceInYears, differenceInMonths, differenceInDays } from "date-fns";
import { Duration } from "../../contract-types/data-contracts";

export const getDuration = ({ startDate, endDate }: Record<'startDate' | 'endDate', Date>): Duration => {
  const years = differenceInYears(endDate, startDate);
  const months = differenceInMonths(endDate, startDate) % 12;
  const days = differenceInDays(endDate, startDate) % 30;

  return {
    years,
    months,
    days
  };
}

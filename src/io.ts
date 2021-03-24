import { CalendarDate } from './calendar-date';
import { monthName, monthNumber } from './consts';

export const parseIso8601String = (date: string): CalendarDate => {
  if (date.length < 10) {
    throw `The string "${date}" is too short to be a date string of the format YYYY-MM-DD`;
  }
  const iso8601DateStringRegex = /^(\d{4})-(\d{2})-(\d{2})/;
  const match = iso8601DateStringRegex.exec(date);
  if (!match) {
    throw `The string "${date}" does not match the ISO 8601 date string format YYYY-MM-DD`;
  }
  const [, year, month, day] = (match as any) as string[];
  return {
    year: parseInt(year),
    month: monthName(parseInt(month)),
    day: parseInt(day),
  };
};

export const serializeIso8601String = ({ year, month, day }: CalendarDate) => {
  const capString = (n: number, s: number) =>
    s.toString().padStart(n, '0').slice(0, n);
  const yyyy = capString(4, year);
  const mm = capString(2, monthNumber(month));
  const dd = capString(2, day);
  return `${yyyy}-${mm}-${dd}`;
};

import { CalendarDate, numberOfDaysInMonth } from './calendar-date';
import { monthName, monthNumber } from './consts';

/**
 * Parses strings of the form "YYYY-MM-DD", in accordance to ISO 8601.
 *
 * Example: "2020-02-24" becomes `{ year: 2020, month: 'feb', day: 24 }`
 *
 * Be careful that your data is formatted properly. ISO 8601 does not permit
 * "YYYY-M-D", so for instance "2020-2-24" would not parse.
 */
export const parseIso8601String = (date: string): CalendarDate => {
  if (date.length < 10) {
    throw `The string "${date}" is too short to be a date string of the format YYYY-MM-DD`;
  }
  const iso8601DateStringRegex = /^(\d{4})-(\d{2})-(\d{2})/;
  const match = iso8601DateStringRegex.exec(date);
  if (!match) {
    throw `The string "${date}" does not match the ISO 8601 date string format YYYY-MM-DD`;
  }
  const [, yearString, monthString, dayString] = match as any as string[];

  const year = parseInt(yearString, 10);

  const monthNumber = parseInt(monthString, 10);
  if (monthNumber < 1 || monthNumber > 12) {
    throw `The string "${date}" does not have a month number between 01 and 12`;
  }
  const month = monthName(monthNumber);

  const calMonth = { year, month };

  const day = parseInt(dayString, 10);

  const daysInMonth = numberOfDaysInMonth(calMonth);
  if (day < 1 || day > daysInMonth) {
    throw (
      `The date represented by the string "${date}" does not have that many days in its month.` +
      ` It only has ${daysInMonth} days`
    );
  }

  return {
    ...calMonth,
    day,
  };
};

/**
 * Serializes a `CalendarDate` object to the standard ISO 8601 form YYYY-MM-DD.
 *
 * Example: `{ year: 2020, month: 'feb', day: 24 }` becomes "2020-02-24"
 */
export const serializeIso8601String = ({ year, month, day }: CalendarDate) => {
  const capString = (n: number, s: number) =>
    s.toString().padStart(n, '0').slice(0, n);
  const yyyy = capString(4, year);
  const mm = capString(2, monthNumber(month));
  const dd = capString(2, day);
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Warning: this inherits all the flakyness of JavaScript's `Date` objects
 * and all similar systems this library specifially tries to avoid.
 *
 * This will be user client dependent! If this code runs on a client with a "wrong"
 * or unusal timezone or other settings, the result will probably not be what you expect.
 *
 * Please don't use this if you can avoid it. The only usecase I would recommend is calling it with
 * `new Date()` to get a `CalendarDate` representing the current date on the client. But again,
 * depending on the client's settings, this isn't necessarily reliable.
 */
export const calendarDateFromJsDateObject = (jsDate: Date): CalendarDate => ({
  year: jsDate.getFullYear(),
  month: monthName(jsDate.getMonth() + 1),
  day: jsDate.getDate(),
});

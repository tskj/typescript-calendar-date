import { mod } from './utils';

export type Year = number;

export type Month =
  | 'jan'
  | 'feb'
  | 'mar'
  | 'apr'
  | 'may'
  | 'jun'
  | 'jul'
  | 'aug'
  | 'sep'
  | 'oct'
  | 'nov'
  | 'dec';

export type Day = number;

export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export const weekDays: WeekDay[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
];

const months: Month[] = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

/**
 * Tells you the number of the month; one indexed like the real world.
 * That is, January is the first month, i.e. 1 and December 12.
 */
export const monthNumber = (month: Month): number => {
  switch (month) {
    case 'jan':
      return 1;
    case 'feb':
      return 2;
    case 'mar':
      return 3;
    case 'apr':
      return 4;
    case 'may':
      return 5;
    case 'jun':
      return 6;
    case 'jul':
      return 7;
    case 'aug':
      return 8;
    case 'sep':
      return 9;
    case 'oct':
      return 10;
    case 'nov':
      return 11;
    case 'dec':
      return 12;
  }
};

/**
 * Converts the month number, i.e. `1`, to the "name" of the month,
 * in this case `'jan'`. These `Month` abbreviated month names are what
 * this library understands.
 *
 * This input parameter wraps around, if you pass it `13`, that is
 * also `'jan'`
 */
export const monthName = (n: number): Month =>
  months[mod(n - 1, months.length)];

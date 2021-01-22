import {
  Day,
  Month,
  monthName,
  monthNumber,
  WeekDay,
  weekDays,
  Year,
} from './consts';
import { mod } from './utils';

type CalendarYear = { year: Year };
type CalendarMonth = CalendarYear & { month: Month };
type CalendarDate = CalendarMonth & { day: Day };

const isLeapYear = ({ year }: CalendarYear) => {
  if (year % 400 === 0) {
    return true;
  }
  if (year % 100 === 0) {
    return false;
  }
  if (year % 4 === 0) {
    return true;
  }
  return false;
};

const numberOfDaysInMonth = ({ year, month }: CalendarMonth): Day => {
  switch (month) {
    case 'jan':
      return 31;
    case 'feb':
      if (isLeapYear({ year })) {
        return 29;
      } else {
        return 28;
      }
    case 'mar':
      return 31;
    case 'apr':
      return 30;
    case 'may':
      return 31;
    case 'jun':
      return 30;
    case 'jul':
      return 31;
    case 'aug':
      return 31;
    case 'sep':
      return 30;
    case 'oct':
      return 31;
    case 'nov':
      return 30;
    case 'dec':
      return 31;
  }
};

export const addCalendarMonths = (
  { year, month }: CalendarMonth,
  months: number
): CalendarMonth => {
  const monthNumberZeroIndexed = monthNumber(month) - 1;
  return {
    year: year + Math.floor((monthNumberZeroIndexed + months) / 12),
    month: monthName(mod(monthNumberZeroIndexed + months, 12) + 1),
  };
};

export const addCalendarDays = (
  { year, month, day }: CalendarDate,
  days: number
): CalendarDate => {
  if (days < 0) {
    const daysToRemove = -days;
    if (daysToRemove < day) {
      return {
        year,
        month,
        day: day - daysToRemove,
      };
    } else {
      const prevMonth = addCalendarMonths({ year, month }, -1);
      return addCalendarDays(
        {
          ...prevMonth,
          day: numberOfDaysInMonth(prevMonth),
        },
        -(daysToRemove - day)
      );
    }
  }

  const daysLeftInMonth = numberOfDaysInMonth({ year, month }) - day;
  if (days <= daysLeftInMonth) {
    return { year, month, day: day + days };
  } else {
    return addCalendarDays(
      { ...addCalendarMonths({ year, month }, 1), day: 0 },
      days - daysLeftInMonth
    );
  }
};

export const calendarDateLessThan = (a: CalendarDate, b: CalendarDate) => {
  if (a.year < b.year) {
    return true;
  }
  if (a.year === b.year) {
    if (monthNumber(a.month) < monthNumber(b.month)) {
      return true;
    }
    if (a.month === b.month) {
      if (a.day < b.day) {
        return true;
      }
    }
  }
  return false;
};

export const calendarDateEqual = (a: CalendarDate, b: CalendarDate) =>
  !calendarDateLessThan(a, b) && !calendarDateLessThan(b, a);

export const exponentialSearch = (
  pred: (n: number) => boolean
): [number, number] => {
  const atZero = pred(0);
  let n = 1;
  while (true) {
    if (pred(n) !== atZero) {
      break;
    }
    if (pred(-n) !== atZero) {
      n *= -1;
      break;
    }
    n *= 2;
  }
  if (n < 0) {
    return [n, 0];
  } else {
    return [0, n];
  }
};

export const binarySearch = (
  pred: (n: number) => boolean,
  [start, end]: [number, number]
): number => {
  if (pred(end)) {
    return end;
  }

  const middle = Math.floor((start + end) / 2);
  const atMiddle = pred(middle);

  if (atMiddle) {
    return binarySearch(pred, [middle, end - 1]);
  } else {
    return binarySearch(pred, [start, middle - 1]);
  }
};

const solve = (pred: (n: number) => boolean): number => {
  const range = exponentialSearch(pred);
  return binarySearch(pred, range);
};

export const differenceInCalendarMonths = (
  a: CalendarMonth,
  b: CalendarMonth
): number => {
  const lteq = (a: CalendarMonth, b: CalendarMonth) =>
    calendarDateLessThan({ ...a, day: 1 }, { ...b, day: 1 }) ||
    calendarDateEqual({ ...a, day: 1 }, { ...b, day: 1 });
  const n = solve((n) => lteq(addCalendarMonths(a, n), b));
  return n;
};

export const differenceInCalendarDays = (
  a: CalendarDate,
  b: CalendarDate
): number => {
  const lteq = (a: CalendarDate, b: CalendarDate) =>
    calendarDateLessThan(a, b) || calendarDateEqual(a, b);
  const n = solve((n) => lteq(addCalendarDays(a, n), b));
  return n;
};

export const dayOfWeek = ({ year, month, day }: CalendarDate): WeekDay => {
  // monday
  const firstOf2021: CalendarDate = { year: 2021, month: 'jan', day: 4 };
  const diff = differenceInCalendarDays(firstOf2021, { year, month, day });
  return weekDays[mod(diff, 7)];
};

// wanna add years? Do it yourself
// parsing and formating? Do it yourself

export const lastDayOfMonth = ({
  year,
  month,
}: CalendarMonth): CalendarDate => ({
  year,
  month,
  day: numberOfDaysInMonth({ year, month }),
});

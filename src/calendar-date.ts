import {
  Day,
  Month,
  monthName,
  monthNumber,
  WeekDay,
  weekDays,
  Year,
} from './consts';
import { mod, solve } from './utils';

//
// Foundations
//

export type CalendarYear = { year: Year };
export type CalendarMonth = CalendarYear & { month: Month };
export type CalendarDate = CalendarMonth & { day: Day };

export const isLeapYear = ({ year }: CalendarYear) => {
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

export const numberOfDaysInMonth = ({ year, month }: CalendarMonth): Day => {
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

export const dayOfWeek = ({ year, month, day }: CalendarDate): WeekDay => {
  const firstMondayOf2021: CalendarDate = { year: 2021, month: 'jan', day: 4 };
  const diff = numberOfCalendarDaysBetween({
    start: firstMondayOf2021,
    end: {
      year,
      month,
      day,
    },
  });
  return weekDays[mod(diff, 7)];
};

export const addCalendarMonths = (
  { year, month }: CalendarMonth,
  months: number,
): CalendarMonth => {
  const monthNumberZeroIndexed = monthNumber(month) - 1;
  return {
    year: year + Math.floor((monthNumberZeroIndexed + months) / 12),
    month: monthName(mod(monthNumberZeroIndexed + months, 12) + 1),
  };
};

/**
 * Returns a new `CalendarDate` object, `daysToAdd` (integer) number of days in the future (or past if negative).
 * Always retunrs a new (instance of) an object, even if you try to add `0` days.
 */
export const addCalendarDays = (
  { year, month, day }: CalendarDate,
  daysToAdd: number,
): CalendarDate => {
  const daysInMonth = numberOfDaysInMonth({ year, month });
  if (day > daysInMonth) {
    return addCalendarDays(
      { year, month, day: daysInMonth },
      day - daysInMonth,
    );
  }
  if (day < 0) {
    return addCalendarDays({ year, month, day: 0 }, day);
  }
  if (day === 0 && daysToAdd === 0) {
    const prevMonth = addCalendarMonths({ year, month }, -1);
    return {
      ...prevMonth,
      day: numberOfDaysInMonth(prevMonth),
    };
  }
  if (daysToAdd === 0) {
    return addCalendarDays({ year, month, day: 0 }, day);
  }

  // daysToAdd cannot be 0
  // day has to be 0 or [1, daysInMonth] (inclusive)

  if (daysToAdd < 0) {
    // daysToRemove is a positive number
    const daysToRemove = -daysToAdd;
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
        -(daysToRemove - day),
      );
    }
  } else {
    // daysToAdd > 0
    // daysLeftInMonth can be [0, daysInMonth]
    const daysLeftInMonth = daysInMonth - day;
    if (daysToAdd <= daysLeftInMonth) {
      return { year, month, day: day + daysToAdd };
    } else {
      return addCalendarDays(
        { ...addCalendarMonths({ year, month }, 1), day: 0 },
        daysToAdd - daysLeftInMonth,
      );
    }
  }
};

//
// Low level implementations
//

/**
 * Low level implementation of `a < b` for `CalendarMonth`.
 * There might exist a more appropriate function for your usecase.
 */
export const calendarMonthLessThan = (a: CalendarMonth, b: CalendarMonth) => {
  if (a.year < b.year) {
    return true;
  }
  if (a.year === b.year) {
    return monthNumber(a.month) < monthNumber(b.month);
  }
  return false;
};

/**
 * Low level implementation of `a == b` for `CalendarMonth`.
 * There might exist a more appropriate function for your usecase.
 */
export const calendarMonthsEqual = (a: CalendarMonth, b: CalendarMonth) =>
  !calendarMonthLessThan(a, b) && !calendarMonthLessThan(b, a);

/**
 * Low level implementation of `a < b` for `CalendarDate`.
 * You probably want `isInOrder(a,b)`.
 */
export const calendarDateLessThan = (a: CalendarDate, b: CalendarDate) => {
  if (calendarMonthLessThan(a, b)) {
    return true;
  }
  if (calendarMonthsEqual(a, b)) {
    if (a.day < b.day) {
      return true;
    }
  }
  return false;
};

/**
 * Low level implementation of `a == b` for `CalendarDate`.
 * You might want `isInOrder(a,b)`, but this is the correct function if you
 * want to test two dates for equality.
 */
export const calendarDatesEqual = (a: CalendarDate, b: CalendarDate) =>
  !calendarDateLessThan(b, a) && !calendarDateLessThan(b, a);

//
// Library functions
//

/**
 * `areInOrder` is true whenever all dates passed to it are in
 * monotonically increasing order (subsequent equal dates are fine).
 *
 * Example: `Jan 1, Jan 2, Jan 2, Jan 3` => `true`
 *
 * This is useful if you want to know if two dates `a` and `b` come after
 * each other, as in `areInOrder(a,b)`, but also if you want to know
 * if the date `c` is "between" `a` and `b`: `areInOrder(a,c,b)`.
 */
export const areInOrder = (...dates: CalendarDate[]): boolean => {
  const lteq = (a: CalendarDate, b: CalendarDate) =>
    calendarDateLessThan(a, b) || calendarDatesEqual(a, b);
  if (dates.length <= 1) {
    return true;
  }
  const [a, b, ...rest] = dates;
  if (lteq(a, b)) {
    return areInOrder(...rest);
  }
  return false;
};

/**
 * Similar to `numberOfCalendarDaysBetween`, except it only takes months
 * into account. You can pass in `CalendarDate` objects; only the month part
 * is taken into account.
 * It calculates the number of months `end - start`.
 */
export const numberOfCalendarMonthsBetween = ({
  start,
  end,
}: {
  start: CalendarMonth;
  end: CalendarMonth;
}): number => {
  const lteq = (a: CalendarMonth, b: CalendarMonth) =>
    calendarMonthLessThan(a, b)
      ? 'lt'
      : calendarMonthsEqual(a, b)
      ? 'eq'
      : 'gt';
  const n = solve((n) => lteq(addCalendarMonths(start, n), end));
  return n;
};

/**
 * The opposite of `addCalendarDays`, in a sense it works like subtraction.
 * The result is `end - start`. This means that calling it with
 * the same date for `start` and `end` gives 0.
 */
export const numberOfCalendarDaysBetween = ({
  start: a,
  end: b,
}: {
  start: CalendarDate;
  end: CalendarDate;
}): number => {
  const lteq = (a: CalendarDate, b: CalendarDate) =>
    calendarDateLessThan(a, b) ? 'lt' : calendarDatesEqual(a, b) ? 'eq' : 'gt';
  const n = solve((n) => lteq(addCalendarDays(a, n), b));
  return n;
};

/**
 * Constructs a `CalendarDate` object which represents the last
 * day of the month, taking into account leap years. If you are looking
 * for `firstDateInMonth`: just construct the object yourself:
 * `{ year, month, day: 1 }`.
 */
export const lastDateInMonth = ({
  year,
  month,
}: CalendarMonth): CalendarDate => ({
  year,
  month,
  day: numberOfDaysInMonth({ year, month }),
});

/**
 * Returns a list of all `CalendarDate`s from `a` up to and including `b`, in sequence.
 * This means it's an inclusive range in both ends. If `b` comes before `a` you get an empty list.
 */
export const periodOfCalendarDates = (
  a: CalendarDate,
  b: CalendarDate,
): CalendarDate[] => {
  if (calendarDateLessThan(b, a)) {
    return [];
  }
  return [a, ...periodOfCalendarDates(addCalendarDays(a, 1), b)];
};

/**
 * Similar to `periodOfCalendarDates`.
 * Returns a list of all `CalendarMonth`s from `a` up to and including `b`, in sequence.
 * This means it's an inclusive range in both ends. If `b` comes before `a` you get an empty list.
 * You can pass in `CalendarDate` objects if you'd like.
 */
export const periodOfCalendarMonths = (
  a: CalendarMonth,
  b: CalendarMonth,
): CalendarMonth[] => {
  if (calendarMonthLessThan(b, a)) {
    return [];
  }
  return [a, ...periodOfCalendarMonths(addCalendarMonths(a, 1), b)];
};

import {
  Day,
  Month,
  monthName,
  monthNumber,
  WeekDay,
  weekDays,
  Year,
} from './consts';
import { memoize, mod, solve, trampoline } from './utils';

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

export const numberOfDaysInMonth = ({ year, month }: CalendarMonth): number => {
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
  const diff = numberOfDaysBetween({
    start: firstMondayOf2021,
    end: {
      year,
      month,
      day,
    },
  });
  return weekDays[mod(diff, 7)];
};

export const addMonths = (
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
export const addDays: (
  date: CalendarDate,
  n: number,
) => CalendarDate = trampoline(
  ({ year, month, day }: CalendarDate, daysToAdd: number) => {
    const daysInMonth = numberOfDaysInMonth({ year, month });
    if (day > daysInMonth) {
      return {
        recurse: true,
        params: [{ year, month, day: daysInMonth }, day - daysInMonth],
      };
    }
    if (day < 0) {
      return {
        recurse: true,
        params: [{ year, month, day: 0 }, day],
      };
    }
    if (day === 0 && daysToAdd === 0) {
      const prevMonth = addMonths({ year, month }, -1);
      return {
        recurse: false,
        return: {
          ...prevMonth,
          day: numberOfDaysInMonth(prevMonth),
        },
      };
    }
    if (daysToAdd === 0) {
      return {
        recurse: true,
        params: [{ year, month, day: 0 }, day],
      };
    }

    // daysToAdd cannot be 0
    // day has to be 0 or [1, daysInMonth] (inclusive)

    if (daysToAdd < 0) {
      // daysToRemove is a positive number
      const daysToRemove = -daysToAdd;
      if (daysToRemove < day) {
        return {
          recurse: false,
          return: {
            year,
            month,
            day: day - daysToRemove,
          },
        };
      } else {
        const prevMonth = addMonths({ year, month }, -1);
        return {
          recurse: true,
          params: [
            {
              ...prevMonth,
              day: numberOfDaysInMonth(prevMonth),
            },
            -(daysToRemove - day),
          ],
        };
      }
    } else {
      // daysToAdd > 0
      // daysLeftInMonth can be [0, daysInMonth]
      const daysLeftInMonth = daysInMonth - day;
      if (daysToAdd <= daysLeftInMonth) {
        return {
          recurse: false,
          return: { year, month, day: day + daysToAdd },
        };
      } else {
        return {
          recurse: true,
          params: [
            { ...addMonths({ year, month }, 1), day: 0 },
            daysToAdd - daysLeftInMonth,
          ],
        };
      }
    }
  },
);

//
// Low level implementations
//

/**
 * Low level implementation of `a < b` for `CalendarMonth`.
 * There might exist a more appropriate function for your usecase.
 */
export const isMonthBefore = (a: CalendarMonth, b: CalendarMonth) => {
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
export const monthsEqual = (a: CalendarMonth, b: CalendarMonth) =>
  !isMonthBefore(a, b) && !isMonthBefore(b, a);

/**
 * Low level implementation of `a < b` for `CalendarDate`.
 * You probably want `isInOrder(a,b)`.
 */
export const isDateBefore = (a: CalendarDate, b: CalendarDate) => {
  if (isMonthBefore(a, b)) {
    return true;
  }
  if (monthsEqual(a, b)) {
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
export const datesEqual = (a: CalendarDate, b: CalendarDate) =>
  !isDateBefore(a, b) && !isDateBefore(b, a);

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
 * each other, as in `areInOrder(a,b)` (which is equivalent to a <= b),
 * but also if you want to know if the date `c` is "between"
 * `a` and `b`: `areInOrder(a,c,b)` (which is equivalent to a <= c <= b).
 */
export const areInOrder = (...dates: CalendarDate[]): boolean => {
  const lteq = (a: CalendarDate, b: CalendarDate) =>
    isDateBefore(a, b) || datesEqual(a, b);
  if (dates.length <= 1) {
    return true;
  }
  const [a, b, ...rest] = dates;
  if (lteq(a, b)) {
    return areInOrder(b, ...rest);
  }
  return false;
};

/**
 * Similar to `numberOfDaysBetween`, except it only takes months
 * into account. You can pass in `CalendarDate` objects; only the month part
 * is taken into account.
 * It calculates the number of months `end - start`.
 */
export const numberOfMonthsBetween = ({
  start: a,
  end: b,
}: {
  start: CalendarMonth;
  end: CalendarMonth;
}): number => {
  const lteq = (a: CalendarMonth, b: CalendarMonth) =>
    isMonthBefore(a, b) ? 'lt' : monthsEqual(a, b) ? 'eq' : 'gt';
  const n = solve((n) => lteq(addMonths(a, n), b));
  return n;
};

/**
 * The opposite of `addDays`, in a sense it works like subtraction.
 * The result is `end - start`. This means that calling it with
 * the same date for `start` and `end` gives 0.
 */
export const numberOfDaysBetween = ({
  start: a,
  end: b,
}: {
  start: CalendarDate;
  end: CalendarDate;
}): number => {
  const lteq = (a: CalendarDate, b: CalendarDate) =>
    isDateBefore(a, b) ? 'lt' : datesEqual(a, b) ? 'eq' : 'gt';
  const m_addDays = memoize(addDays);
  const n = solve((n) => lteq(m_addDays(a, n), b));
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
export const periodOfDates = (
  a: CalendarDate,
  b: CalendarDate,
): CalendarDate[] => {
  const periodOfDatesRec: (
    a: CalendarDate,
    b: CalendarDate,
    acc: CalendarDate[],
  ) => CalendarDate[] = trampoline(
    (a: CalendarDate, b: CalendarDate, acc: CalendarDate[]) => {
      if (isDateBefore(b, a)) {
        return { recurse: false, return: acc };
      }
      return { recurse: true, params: [addDays(a, 1), b, [...acc, a]] };
    },
  );
  return periodOfDatesRec(a, b, []);
};

/**
 * Similar to `periodOfCalendarDates`.
 * Returns a list of all `CalendarMonth`s from `a` up to and including `b`, in sequence.
 * This means it's an inclusive range in both ends. If `b` comes before `a` you get an empty list.
 * You can pass in `CalendarDate` objects if you'd like.
 */
export const periodOfMonths = (
  a: CalendarMonth,
  b: CalendarMonth,
): CalendarMonth[] => {
  if (isMonthBefore(b, a)) {
    return [];
  }
  return [a, ...periodOfMonths(addMonths(a, 1), b)];
};

export const startOfWeek = (
  date: CalendarDate,
  { firstDayOfWeek }: { firstDayOfWeek: WeekDay } = { firstDayOfWeek: 'mon' },
): CalendarDate => {
  if (dayOfWeek(date) === firstDayOfWeek) {
    return date;
  }
  return startOfWeek(addDays(date, -1), { firstDayOfWeek });
};

export const isWeekend = (date: CalendarDate) =>
  dayOfWeek(date) === 'sat' || dayOfWeek(date) === 'sun';

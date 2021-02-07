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
  daysToAdd: number
): CalendarDate => {
  const daysInMonth = numberOfDaysInMonth({ year, month });
  if (day > daysInMonth) {
    return addCalendarDays(
      { year, month, day: daysInMonth },
      day - daysInMonth
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
        -(daysToRemove - day)
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
        daysToAdd - daysLeftInMonth
      );
    }
  }
};

export const calendarDateBefore = (a: CalendarDate, b: CalendarDate) => {
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
  !calendarDateBefore(a, b) && !calendarDateBefore(b, a);

type Order = 'lt' | 'eq' | 'gt';

export const exponentialSearch = (
  pred: (n: number) => Order
): [number, number] => {
  if (pred(0) === 'eq') {
    return [0, 0];
  }
  const direction = pred(0) === 'lt' ? 1 : -1;
  const search = (o: Order, n: number) => {
    if (pred(n) !== o) {
      if (n < 0) {
        return [n, Math.floor(n / 2)];
      } else {
        return [Math.floor(n / 2), n];
      }
    }
    return search(o, n * 2);
  };
  return search(pred(0), direction);
};

export const binarySearch = (
  pred: (n: number) => Order,
  [start, end]: [number, number]
): number => {
  const middle = Math.floor((start + end) / 2);
  const atMiddle = pred(middle);

  if (atMiddle === 'eq') {
    return middle;
  } else if (atMiddle === 'lt') {
    return binarySearch(pred, [middle + 1, end]);
  } else {
    return binarySearch(pred, [start, middle - 1]);
  }
};

const solve = (pred: (n: number) => Order): number => {
  const range = exponentialSearch(pred);
  return binarySearch(pred, range);
};

export const numberOfCalendarMonthsBetween = (
  a: CalendarMonth,
  b: CalendarMonth
): number => {
  const lteq = (a: CalendarMonth, b: CalendarMonth) =>
    calendarDateBefore({ ...a, day: 1 }, { ...b, day: 1 })
      ? 'lt'
      : calendarDateEqual({ ...a, day: 1 }, { ...b, day: 1 })
      ? 'eq'
      : 'gt';
  const n = solve((n) => lteq(addCalendarMonths(a, n), b));
  return n;
};

export const numberOfCalendarDaysBetween = (
  a: CalendarDate,
  b: CalendarDate
): number => {
  const lteq = (a: CalendarDate, b: CalendarDate) =>
    calendarDateBefore(a, b) ? 'lt' : calendarDateEqual(a, b) ? 'eq' : 'gt';
  const n = solve((n) => lteq(addCalendarDays(a, n), b));
  return n;
};

export const dayOfWeek = ({ year, month, day }: CalendarDate): WeekDay => {
  const firstMondayof2021: CalendarDate = { year: 2021, month: 'jan', day: 4 };
  const diff = numberOfCalendarDaysBetween(firstMondayof2021, {
    year,
    month,
    day,
  });
  return weekDays[mod(diff, 7)];
};

// wanna add years? Do it yourself
// parsing and formating? Do it yourself

export const lastDateInMonth = ({
  year,
  month,
}: CalendarMonth): CalendarDate => ({
  year,
  month,
  day: numberOfDaysInMonth({ year, month }),
});

export const addMonthsWithClampedDay = (
  { year, month, day }: CalendarDate,
  months: number
): CalendarDate => {
  const m = addCalendarMonths({ year, month }, months);
  const dayOfMonth = Math.min(day, numberOfDaysInMonth(m));
  return { ...m, day: dayOfMonth };
};

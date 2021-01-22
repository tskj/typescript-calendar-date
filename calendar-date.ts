import { Day, Month, monthName, monthNumber, Year } from './consts';
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

// difference in months
// difference in days

// day of week

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

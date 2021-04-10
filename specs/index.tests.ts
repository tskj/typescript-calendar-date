import fc from 'fast-check';
import {
  addDays,
  CalendarDate,
  numberOfDaysBetween,
  numberOfDaysInMonth,
  periodOfDates,
  isLeapYear,
  areInOrder,
} from '../src';
import { fcCalendarDate } from './generators';

test('Difference in days', () => {
  fc.assert(
    fc.property(
      fcCalendarDate(),
      fc.integer(-2000 * 365, 2000 * 365),
      (date, days) => {
        const laterDay = addDays(date, days);
        const diff = numberOfDaysBetween({ start: date, end: laterDay });
        expect(diff).toBe(days);
      },
    ),
  );
});

test('Number of days in leapyears', () => {
  fc.assert(
    fc.property(fcCalendarDate(), (date) => {
      const startOfYear: CalendarDate = { ...date, month: 'jan', day: 1 };
      const endOfYear: CalendarDate = { ...date, month: 'dec', day: 31 };
      const allDaysInYear = periodOfDates(startOfYear, endOfYear);
      const numberOfDays =
        numberOfDaysBetween({ start: startOfYear, end: endOfYear }) + 1;
      const numberOfDaysInSuchAYear = isLeapYear(date) ? 366 : 365;
      expect(allDaysInYear.length).toBe(numberOfDaysInSuchAYear);
      expect(numberOfDays).toBe(numberOfDaysInSuchAYear);
    }),
  );
});

test('Number of days in month', () => {
  fc.assert(
    fc.property(fcCalendarDate(), (date) => {
      const startOfMonth: CalendarDate = { ...date, day: 1 };
      const endOfMonth: CalendarDate = {
        ...date,
        day: numberOfDaysInMonth(date),
      };
      const allDaysInMonth = periodOfDates(startOfMonth, endOfMonth);
      const numberOfDays =
        numberOfDaysBetween({
          start: startOfMonth,
          end: endOfMonth,
        }) + 1;
      expect(allDaysInMonth.length).toBe(numberOfDays);
      expect(numberOfDays).toBe(numberOfDaysInMonth(date));
      expect([28, 29, 30, 31]).toContain(numberOfDays);
    }),
  );
});

test('Are-in-order has positive diff', () => {
  fc.assert(
    fc.property(fcCalendarDate(), fcCalendarDate(), (a, b) => {
      const areOrdered = areInOrder(a, b);
      const diff = numberOfDaysBetween({ start: a, end: b });
      const negativeDiff = diff < 0;
      expect(!areOrdered).toBe(negativeDiff);
    }),
  );
});

test('Normalization works', () => {
  fc.assert(
    fc.property(
      fcCalendarDate(),
      fc.integer(-100 * 365, 100 * 365),
      (date, n) => {
        const otherDate = addDays(date, n);
        const sameOtherDate = addDays({ ...date, day: date.day + n }, 0);
        expect(otherDate).toEqual(sameOtherDate);
      },
    ),
  );
});

test('Period of dates has correct number of days', () => {
  fc.assert(
    fc.property(fcCalendarDate(), fcCalendarDate(), (a, b) => {
      const daysBetween = numberOfDaysBetween({ start: a, end: b }) + 1;
      if (Math.abs(daysBetween) > 2000) {
        return;
      }
      const allDaysInPeriod = periodOfDates(a, b);
      expect(allDaysInPeriod.length).toBe(Math.max(daysBetween, 0));
    }),
  );
});

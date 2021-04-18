import fc from 'fast-check';
import {
  addDays,
  CalendarDate,
  numberOfDaysBetween,
  numberOfDaysInMonth,
  periodOfDates,
  isLeapYear,
  areInOrder,
  isDateBefore,
  datesEqual,
  startOfWeek,
  serializeIso8601String,
  parseIso8601String,
  addMonths,
} from '../src';
import { fcCalendarDate, fcCalendarMonth, fcWeekDay } from './generators';
import { repeat } from './utils';

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

test('Add days', () => {
  fc.assert(
    fc.property(fcCalendarDate(), fcCalendarDate(), (a, b) => {
      const diff = numberOfDaysBetween({ start: a, end: b });

      const bPrime = addDays(a, diff);
      expect(bPrime).toEqual(b);

      const aPrime = addDays(b, -diff);
      expect(aPrime).toEqual(a);
    }),
  );
});

test('Adding days sequentially', () => {
  fc.assert(
    fc.property(fcCalendarDate(), fc.integer(-100, 100), (date, n) => {
      const otherDate = addDays(date, n);
      const step = n < 0 ? -1 : 1;
      const otherDatePrime = repeat(Math.abs(n), (d) => addDays(d, step), date);
      expect(otherDate).toEqual(otherDatePrime);
    }),
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

test('Ordered dates', () => {
  fc.assert(
    fc.property(fc.array(fcCalendarDate()), (dates) => {
      const orderedDates = dates.sort((a, b) =>
        isDateBefore(a, b) ? -1 : datesEqual(a, b) ? 0 : 1,
      );
      expect(areInOrder(...orderedDates)).toBe(true);
    }),
  );
});

test('Ordered ints', () => {
  fc.assert(
    fc.property(
      fcCalendarDate(),
      fc.array(fc.integer(-100, 100)),
      (date, ints) => {
        const orderedInts = ints.sort((a, b) => a - b);
        const shiftDays = (n: number) => addDays(date, n);
        const dates = orderedInts.map(shiftDays);
        expect(areInOrder(...dates)).toBe(true);
      },
    ),
  );
});

test('Start of week is in the past', () => {
  fc.assert(
    fc.property(fcCalendarDate(), (date) => {
      const startOfThisWeek = startOfWeek(date);
      expect(areInOrder(startOfThisWeek, date)).toBe(true);
      expect(
        numberOfDaysBetween({ start: startOfThisWeek, end: date }),
      ).toBeLessThan(7);
    }),
  );
});

test('Start of week is in the past for any start of week', () => {
  fc.assert(
    fc.property(fcCalendarDate(), fcWeekDay(), (date, weekStart) => {
      const startOfThisWeek = startOfWeek(date, { firstDayOfWeek: weekStart });
      expect(areInOrder(startOfThisWeek, date)).toBe(true);
      expect(
        numberOfDaysBetween({ start: startOfThisWeek, end: date }),
      ).toBeLessThan(7);
    }),
  );
});

test('Serialize and parse', () => {
  fc.assert(
    fc.property(fcCalendarDate(), (date) => {
      const serialized = serializeIso8601String(date);
      const parsed = parseIso8601String(serialized);
      expect(parsed).toEqual(date);
    }),
  );
});

test('Adding more than a year of days', () => {
  fc.assert(
    fc.property(fcCalendarDate(), fc.integer(-2000, 2000), (date, n) => {
      const otherDate = addDays(date, n);
      if (Math.abs(n) >= 366) {
        expect(date.year !== otherDate.year).toBe(true);
      }
    }),
  );
});

test('Associativity', () => {
  fc.assert(
    fc.property(
      fcCalendarDate(),
      fc.integer(-500 * 365, 500 * 365),
      fc.integer(-500 * 365, 500 * 365),
      (date, x, y) => {
        expect(addDays(date, x + y)).toEqual(addDays(addDays(date, x), y));
      },
    ),
  );
});

test('Additive identity', () => {
  fc.assert(
    fc.property(fcCalendarDate(), (date) => {
      expect(addDays(date, 0)).toEqual(date);
    }),
  );
});

test('Subtraction identity', () => {
  fc.assert(
    fc.property(fcCalendarDate(), (date) => {
      expect(numberOfDaysBetween({ start: date, end: date })).toBe(0);
    }),
  );
});

test('Associativity for months', () => {
  fc.assert(
    fc.property(
      fcCalendarMonth(),
      fc.integer(-500, 500),
      fc.integer(-500, 500),
      (month, x, y) => {
        expect(addMonths(month, x + y)).toEqual(
          addMonths(addMonths(month, x), y),
        );
      },
    ),
  );
});

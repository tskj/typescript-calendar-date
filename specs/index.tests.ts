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
  dayOfWeek,
  lastDateInMonth,
  monthNumber,
  calendarDateFromJsDateObject,
  monthName,
} from '../src';
import {
  fcCalendarDate,
  fcCalendarMonth,
  fcWeekDay,
  fcYear,
} from './generators';
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
      if (Math.abs(daysBetween) > 1000) {
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
    fc.property(
      fcCalendarDate().filter(({ year }) => 1900 < year && year < 2100),
      (date) => {
        const startOfThisWeek = startOfWeek(date);
        expect(areInOrder(startOfThisWeek, date)).toBe(true);
        expect(
          numberOfDaysBetween({ start: startOfThisWeek, end: date }),
        ).toBeLessThan(7);
        expect(dayOfWeek(startOfThisWeek)).toBe('mon');
      },
    ),
  );
});

test('Start of week is in the past for any start of week', () => {
  fc.assert(
    fc.property(
      fcCalendarDate().filter(({ year }) => 1900 < year && year < 2100),
      fcWeekDay(),
      (date, weekStart) => {
        const startOfThisWeek = startOfWeek(date, {
          firstDayOfWeek: weekStart,
        });
        expect(areInOrder(startOfThisWeek, date)).toBe(true);
        expect(
          numberOfDaysBetween({ start: startOfThisWeek, end: date }),
        ).toBeLessThan(7);
        expect(dayOfWeek(startOfThisWeek)).toBe(weekStart);
      },
    ),
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

test('Serialize', () => {
  fc.assert(
    fc.property(fcCalendarDate(), (date) => {
      const serialized = serializeIso8601String(date);

      expect(serialized.length).toBe(10);

      const yyyymmdd = /^\d{4}-\d{2}-\d{2}$/;
      expect(yyyymmdd.test(serialized)).toBe(true);

      const digitsOrDash = /^[0-9\-]*$/;
      expect(digitsOrDash.test(serialized)).toBe(true);
    }),
  );
});

test('Parse', () => {
  fc.assert(
    fc.property(
      fcYear(),
      fc.integer(0, 9),
      fc.integer(0, 9),
      fc.integer(0, 9),
      fc.integer(0, 9),
      (yearNumber, monthDigit_1, monthDigit_2, dayDigit_1, dayDigit_2) => {
        const mm = `${monthDigit_1}${monthDigit_2}`;
        const dd = `${dayDigit_1}${dayDigit_2}`;

        const yyyymmdd = `${yearNumber}-${mm}-${dd}`;
        const parse = () => parseIso8601String(yyyymmdd);

        if (yearNumber < 1000 || yearNumber > 9999) {
          // Won't be zero-padded
          expect(parse).toThrow();
          return;
        }

        const month = parseInt(mm, 10);
        const day = parseInt(dd, 10);

        if (month === 0 || day === 0 || month > 12 || day > 31) {
          expect(parse).toThrow();
          return;
        }

        if (day <= 28) {
          const calendarDate = {
            year: yearNumber,
            month: monthName(month),
            day,
          };
          expect(parseIso8601String(yyyymmdd)).toEqual(calendarDate);
          expect(parseIso8601String(yyyymmdd + 'T00:00Z')).toEqual(
            calendarDate,
          );
        }

        if (month < 10 || day < 10) {
          // One of these won't be zero padded, so we expect a failure
          const yyyymd = `${yearNumber}-${month}-${day}`;
          expect(() => parseIso8601String(yyyymd)).toThrow();
        }

        // Here we may or may not be legit, depending on the number of days in this month
        // so we test some gibberis for good measure
        expect(() => parseIso8601String('1' + yyyymmdd)).toThrow();
        expect(() =>
          parseIso8601String(yyyymmdd.split('').reverse().join()),
        ).toThrow();
        expect(() => parseIso8601String(yyyymmdd.replace('-', '/'))).toThrow();
      },
    ),
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
      (date, x, y) => {
        expect(addMonths(date, x + y)).toEqual(
          addMonths(addMonths(date, x), y),
        );
      },
    ),
  );
});

test('Adding months', () => {
  fc.assert(
    fc.property(
      fcCalendarDate(),
      fc.integer(-50 * 12, 50 * 12),
      (date, months) => {
        const lastMonth = addMonths(date, months);
        const lastDate = lastDateInMonth(lastMonth);
        const diffInDays = numberOfDaysBetween({ start: date, end: lastDate });

        if (months !== 0) {
          expect(Math.sign(diffInDays)).toBe(Math.sign(months));
        }
      },
    ),
  );
});

test('Adding zero months', () => {
  fc.assert(
    fc.property(fcCalendarDate(), (date) => {
      const lastMonth = addMonths(date, 0);
      const lastDate = lastDateInMonth(lastMonth);
      const diffInDays = numberOfDaysBetween({ start: date, end: lastDate });

      if (datesEqual(date, lastDateInMonth(date))) {
        expect(diffInDays).toBe(0);
      } else {
        expect(diffInDays).toBeGreaterThan(0);
      }

      expect(diffInDays).toBeLessThan(31);
    }),
  );
});

test('Convert from js Date object', () => {
  fc.assert(
    fc.property(fcCalendarDate(), (date) => {
      const { year, month, day } = date;
      const monthIndex = monthNumber(month) - 1;

      const jsDate = new Date(year, monthIndex, day);
      const newDate = calendarDateFromJsDateObject(jsDate);

      expect(date).toEqual(newDate);
    }),
  );
});

import fc from 'fast-check';
import {
  addDays,
  monthName,
  numberOfDaysBetween,
  numberOfDaysInMonth,
} from '../src/';

const fcCalendarDate = () =>
  fc
    .tuple(fc.integer(1000, 3000), fc.integer(1, 12), fc.integer(1, 31))
    .map(([year, monthNumber, day]) => ({
      year,
      month: monthName(monthNumber),
      day,
    }))
    .filter((date) => date.day <= numberOfDaysInMonth(date));

test('Difference in days', () => {
  fc.assert(
    fc.property(
      fcCalendarDate(),
      fc.integer(-200 * 365, 200 * 365),
      (day, days) => {
        const laterDay = addDays(day, days);
        const diff = numberOfDaysBetween({ start: day, end: laterDay });
        expect(diff).toBe(days);
      },
    ),
  );
});

import { monthName } from '.';
import {
  addDays,
  addMonths,
  datesEqual,
  isDateBefore,
  dayOfWeek,
  numberOfDaysBetween,
  periodOfDates,
  CalendarDate,
  areInOrder,
  lastDateInMonth,
} from './calendar-date';

console.log(addMonths({ year: 2020, month: 'jan' }, -18));
console.log(addMonths({ year: 2020, month: 'jan' }, -12));
console.log(addMonths({ year: 2020, month: 'jan' }, -7));
console.log(addMonths({ year: 2020, month: 'jan' }, -6));
console.log(addMonths({ year: 2020, month: 'jan' }, -1));
console.log(addMonths({ year: 2020, month: 'jan' }, 0));
console.log(addMonths({ year: 2020, month: 'jan' }, 1));
console.log(addMonths({ year: 2020, month: 'jan' }, 5));
console.log(addMonths({ year: 2020, month: 'jan' }, 6));
console.log(addMonths({ year: 2020, month: 'jan' }, 12));
console.log(addMonths({ year: 2020, month: 'jan' }, 18));

console.log(addDays({ year: 2020, month: 'jan', day: 1 }, -365));
console.log(addDays({ year: 2021, month: 'jan', day: 1 }, -366));
console.log(addDays({ year: 2021, month: 'jan', day: 1 }, -1));
console.log(addDays({ year: 2021, month: 'jan', day: 1 }, 0));
console.log(addDays({ year: 2021, month: 'jan', day: 1 }, 1));
console.log(addDays({ year: 2021, month: 'jan', day: 1 }, 30));
console.log(addDays({ year: 2021, month: 'jan', day: 1 }, 31));
console.log(addDays({ year: 2021, month: 'jan', day: 1 }, 30 + 28));
console.log(addDays({ year: 2021, month: 'jan', day: 1 }, 30 + 28 + 1));
console.log(addDays({ year: 2021, month: 'jan', day: 1 }, 180));
console.log(addDays({ year: 2021, month: 'jan', day: 1 }, 365));
console.log(addDays({ year: 2021, month: 'jan', day: 1 }, 365 * 2));

console.log(
  periodOfDates(
    {
      year: 2020,
      month: 'oct',
      day: 1,
    },
    {
      year: 2020,
      month: 'dec',
      day: 31,
    },
  ),
);

console.log(
  isDateBefore(
    { year: 2020, month: 'jan', day: 1 },
    { year: 2020, month: 'jan', day: 1 },
  ),
);
console.log(
  isDateBefore(
    { year: 2020, month: 'jan', day: 1 },
    { year: 2020, month: 'jan', day: 2 },
  ),
);
console.log(
  isDateBefore(
    { year: 2020, month: 'jan', day: 1 },
    { year: 2020, month: 'feb', day: 2 },
  ),
);
console.log(
  isDateBefore(
    { year: 2020, month: 'feb', day: 2 },
    { year: 2020, month: 'jan', day: 1 },
  ),
);
console.log(
  isDateBefore(
    { year: 2020, month: 'feb', day: 1 },
    { year: 2020, month: 'jan', day: 2 },
  ),
);
console.log(
  isDateBefore(
    { year: 2019, month: 'feb', day: 1 },
    { year: 2020, month: 'jan', day: 2 },
  ),
);

console.log(
  datesEqual(
    { year: 2020, month: 'feb', day: 2 },
    { year: 2020, month: 'feb', day: 2 },
  ),
);

console.log(
  numberOfDaysBetween({
    start: { year: 2019, month: 'jan', day: 3 },
    end: { year: 2020, month: 'oct', day: 30 },
  }),
);

console.log(
  numberOfDaysBetween({
    start: { year: 1980, month: 'jan', day: 3 },
    end: { year: 2020, month: 'oct', day: 30 },
  }),
);

console.log(
  numberOfDaysBetween({
    start: { year: 2020, month: 'oct', day: 30 },
    end: { year: 1980, month: 'jan', day: 3 },
  }),
);

console.log(dayOfWeek({ year: 1988, month: 'jan', day: 6 }));
console.log(dayOfWeek({ year: 1995, month: 'dec', day: 14 }));

console.log(addDays({ year: 2021, month: 'feb', day: 0 }, 0));
console.log(addDays({ year: 2021, month: 'jan', day: 32 }, 0));
console.log(addDays({ year: 2021, month: 'feb', day: 30 }, 0));
console.log(addDays({ year: 2021, month: 'jan', day: 365 }, 0));
console.log(addDays({ year: 2020, month: 'jan', day: 366 }, 0));
console.log(addDays({ year: 2021, month: 'jan', day: 0 }, 0));
console.log(addDays({ year: 2021, month: 'jan', day: -1 }, 0));
console.log(addDays({ year: 2022, month: 'jan', day: -365 }, 0));

console.log(
  numberOfDaysBetween({
    start: { year: 2019, month: 'jan', day: 3 },
    end: { year: 2020, month: 'oct', day: 30 },
  }),
);

const birthDate: CalendarDate = { year: 1990, month: 'apr', day: 1 };

const today = {
  year: new Date().getFullYear(),
  month: monthName(new Date().getMonth() + 1),
  day: new Date().getDate(),
};

const daysOld = numberOfDaysBetween({ start: birthDate, end: today });
console.log(today);
console.log('days old:', daysOld);

const startOfQ1: CalendarDate = { year: 2021, month: 'jan', day: 1 };
const endOfQ1 = lastDateInMonth({ year: 2021, month: 'mar' });

console.log(areInOrder(startOfQ1, today, endOfQ1));

const apr: CalendarDate = { year: 2021, month: `apr`, day: 15 };
const jun = addMonths(apr, 2);
console.log(numberOfDaysBetween({ start: apr, end: { ...jun, day: 15 } }));

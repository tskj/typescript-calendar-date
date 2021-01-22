import {
  addCalendarDays,
  addCalendarMonths,
  calendarDateEqual,
  calendarDateLessThan,
} from './calendar-date';

console.log(addCalendarMonths({ year: 2020, month: 'jan' }, -18));
console.log(addCalendarMonths({ year: 2020, month: 'jan' }, -12));
console.log(addCalendarMonths({ year: 2020, month: 'jan' }, -7));
console.log(addCalendarMonths({ year: 2020, month: 'jan' }, -6));
console.log(addCalendarMonths({ year: 2020, month: 'jan' }, -1));
console.log(addCalendarMonths({ year: 2020, month: 'jan' }, 0));
console.log(addCalendarMonths({ year: 2020, month: 'jan' }, 1));
console.log(addCalendarMonths({ year: 2020, month: 'jan' }, 5));
console.log(addCalendarMonths({ year: 2020, month: 'jan' }, 6));
console.log(addCalendarMonths({ year: 2020, month: 'jan' }, 12));
console.log(addCalendarMonths({ year: 2020, month: 'jan' }, 18));

console.log(addCalendarDays({ year: 2020, month: 'jan', day: 1 }, -365));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 1 }, -366));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 1 }, -1));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 1 }, 0));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 1 }, 1));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 1 }, 30));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 1 }, 31));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 1 }, 30 + 28));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 1 }, 30 + 28 + 1));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 1 }, 180));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 1 }, 365));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 1 }, 365 * 2));

console.log(
  calendarDateLessThan(
    { year: 2020, month: 'jan', day: 1 },
    { year: 2020, month: 'jan', day: 1 }
  )
);
console.log(
  calendarDateLessThan(
    { year: 2020, month: 'jan', day: 1 },
    { year: 2020, month: 'jan', day: 2 }
  )
);
console.log(
  calendarDateLessThan(
    { year: 2020, month: 'jan', day: 1 },
    { year: 2020, month: 'feb', day: 2 }
  )
);
console.log(
  calendarDateLessThan(
    { year: 2020, month: 'feb', day: 2 },
    { year: 2020, month: 'jan', day: 1 }
  )
);
console.log(
  calendarDateLessThan(
    { year: 2020, month: 'feb', day: 1 },
    { year: 2020, month: 'jan', day: 2 }
  )
);
console.log(
  calendarDateLessThan(
    { year: 2019, month: 'feb', day: 1 },
    { year: 2020, month: 'jan', day: 2 }
  )
);

console.log(
  calendarDateEqual(
    { year: 2020, month: 'feb', day: 2 },
    { year: 2020, month: 'feb', day: 2 }
  )
);

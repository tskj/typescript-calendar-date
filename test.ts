import {
  addCalendarDays,
  addCalendarMonths,
  binarySearch,
  calendarDateEqual,
  calendarDateBefore,
  dayOfWeek,
  numberOfCalendarDaysBetween,
  numberOfCalendarMonthsBetween,
  exponentialSearch,
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
  calendarDateBefore(
    { year: 2020, month: 'jan', day: 1 },
    { year: 2020, month: 'jan', day: 1 }
  )
);
console.log(
  calendarDateBefore(
    { year: 2020, month: 'jan', day: 1 },
    { year: 2020, month: 'jan', day: 2 }
  )
);
console.log(
  calendarDateBefore(
    { year: 2020, month: 'jan', day: 1 },
    { year: 2020, month: 'feb', day: 2 }
  )
);
console.log(
  calendarDateBefore(
    { year: 2020, month: 'feb', day: 2 },
    { year: 2020, month: 'jan', day: 1 }
  )
);
console.log(
  calendarDateBefore(
    { year: 2020, month: 'feb', day: 1 },
    { year: 2020, month: 'jan', day: 2 }
  )
);
console.log(
  calendarDateBefore(
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

console.log(
  numberOfCalendarDaysBetween(
    { year: 2019, month: 'jan', day: 3 },
    { year: 2020, month: 'oct', day: 30 }
  )
);

console.log(
  numberOfCalendarDaysBetween(
    { year: 1980, month: 'jan', day: 3 },
    { year: 2020, month: 'oct', day: 30 }
  )
);

console.log(
  numberOfCalendarDaysBetween(
    { year: 2020, month: 'oct', day: 30 },
    { year: 1980, month: 'jan', day: 3 }
  )
);

console.log(dayOfWeek({ year: 1988, month: 'jan', day: 6 }));
console.log(dayOfWeek({ year: 1995, month: 'dec', day: 14 }));

console.log(addCalendarDays({ year: 2021, month: 'feb', day: 0 }, 0));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 32 }, 0));
console.log(addCalendarDays({ year: 2021, month: 'feb', day: 30 }, 0));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 365 }, 0));
console.log(addCalendarDays({ year: 2020, month: 'jan', day: 366 }, 0));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: 0 }, 0));
console.log(addCalendarDays({ year: 2021, month: 'jan', day: -1 }, 0));
console.log(addCalendarDays({ year: 2022, month: 'jan', day: -365 }, 0));

import fc from 'fast-check';
import { dayOfWeek, monthName, numberOfDaysInMonth } from '../src';

export const fcCalendarDate = () =>
  fc
    .tuple(fcCalendarMonth(), fc.integer(1, 31))
    .map(([month, day]) => ({
      ...month,
      day,
    }))
    .filter((date) => date.day <= numberOfDaysInMonth(date));

export const fcCalendarMonth = () =>
  fc.tuple(fcYear(), fcMonth()).map(([year, month]) => ({ year, month }));

const fcYear = () => fc.integer(1000, 3000);
const fcMonth = () => fc.integer(1, 12).map(monthName);

export const fcWeekDay = () => fcCalendarDate().map(dayOfWeek);

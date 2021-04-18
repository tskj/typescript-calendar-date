import { CalendarDate } from './calendar-date';
import { serializeIso8601String } from './io';

export const mod = (n: number, m: number) => ((n % m) + m) % m;

type Order = 'lt' | 'eq' | 'gt';

const exponentialSearch = (pred: (n: number) => Order): [number, number] => {
  if (pred(0) === 'eq') {
    return [0, 0];
  }
  const direction = pred(0) === 'lt' ? 1 : -1;
  const o = pred(0);
  let n = direction;
  while (true) {
    if (pred(n) !== o) {
      if (n < 0) {
        return [n, Math.ceil(n / 2)];
      } else {
        return [Math.floor(n / 2), n];
      }
    }
    n *= 2;
  }
};

const binarySearch = (
  pred: (n: number) => Order,
  [start, end]: [number, number],
) => {
  while (true) {
    const middle = Math.floor((start + end) / 2);
    const atMiddle = pred(middle);

    if (atMiddle === 'eq') {
      return middle;
    }

    if (atMiddle === 'lt') {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }
};

export const solve = (pred: (n: number) => Order): number => {
  const range = exponentialSearch(pred);
  return binarySearch(pred, range);
};

type trampolinable<T extends unknown[], U> = (
  ...x: T
) => { recurse: true; params: T } | { recurse: false; return: U };
export const trampoline = <T extends unknown[], U>(
  f: trampolinable<T, U>,
): ((...x: T) => U) => (...x: T) => {
  let y = f(...x);
  while (y.recurse) {
    const { params } = y;
    y = f(...params);
  }
  return y.return;
};

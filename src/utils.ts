export const mod = (n: number, m: number) => ((n % m) + m) % m;

type Order = 'lt' | 'eq' | 'gt';

const exponentialSearch = (pred: (n: number) => Order): [number, number] => {
  if (pred(0) === 'eq') {
    return [0, 0];
  }
  const direction = pred(0) === 'lt' ? 1 : -1;
  const search = (o: Order, n: number): [number, number] => {
    if (pred(n) !== o) {
      if (n < 0) {
        return [n, Math.ceil(n / 2)];
      } else {
        return [Math.floor(n / 2), n];
      }
    }
    return search(o, n * 2);
  };
  return search(pred(0), direction);
};

const binarySearch = (
  pred: (n: number) => Order,
  [start, end]: [number, number],
): number => {
  const middle = Math.floor((start + end) / 2);
  const atMiddle = pred(middle);

  if (atMiddle === 'eq') {
    return middle;
  } else if (atMiddle === 'lt') {
    return binarySearch(pred, [middle + 1, end]);
  } else {
    return binarySearch(pred, [start, middle - 1]);
  }
};

export const solve = (pred: (n: number) => Order): number => {
  const range = exponentialSearch(pred);
  return binarySearch(pred, range);
};

type trampolinable<T extends unknown[], U> = (
  ...x: T
) => { recurse: true; params: T } | { recurse: false; return: U };
export const trampoline = <T extends unknown[], U>(f: trampolinable<T, U>) => (
  ...x: T
) => {
  let y = f(...x);
  while (y.recurse) {
    const { params } = y;
    y = f(...params);
  }
  return y.return;
};

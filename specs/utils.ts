export const repeat = <T>(n: number, f: (x: T) => T, x: T) => {
  while (true) {
    if (n <= 0) {
      return x;
    }

    n -= 1;
    x = f(x);
  }
};

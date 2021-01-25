export function add(accumulator = 0, a = 0) {
  return accumulator + a;
}

export const runningTotal = (
  acc: number[],
  x: number,
  i: number,
  set: number[]
) => {
  return [...acc, x + (acc[acc.length - 1] || 0)];
};

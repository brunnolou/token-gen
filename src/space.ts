export const unit = 8;
export const column = unit * 10;
export const gap = unit * 2;
export const horizontalMargin = unit * 3;

export const getColumnWidth = (count = 12, column = unit * 10, gap = unit * 2): number =>
  column * count + gap * (count - 1);

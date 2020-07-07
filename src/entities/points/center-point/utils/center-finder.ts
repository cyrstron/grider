import {CellSide} from '../../../segments/cell-side';

export function getNextCenterByCellSide(
  center: grider.GridPoint,
  segment: CellSide,
): grider.GridPoint {
  const {i, j, k} = center;
  const {
    averagePoint: {i: averI, j: averJ, k: averK},
  } = segment;

  const nextI = Math.round(i + (averI - i) * 2);
  const nextJ = Math.round(j + (averJ - j) * 2);
  const nextK = k !== undefined && averK !== undefined ?
    Math.round(k + (averK - k) * 2) :
    undefined;

  const result: grider.GridPoint = {
    i: nextI,
    j: nextJ,
  };

  if (nextK !== undefined) {
    result.k = nextK;
  }

  return result;
}

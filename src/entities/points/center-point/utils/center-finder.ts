import {CellSide} from '../../../segments/cell-side';
import { CenterPoint } from '../center-point';

export function getNextCenterByCellSide(
  center: CenterPoint,
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

  return {
    i: nextI,
    j: nextJ,
    k: nextK,
  };
}

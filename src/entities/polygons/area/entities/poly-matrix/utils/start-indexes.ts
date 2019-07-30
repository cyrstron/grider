import { PolyMatrix } from "../poly-matrix";
import { calcNearestAndTouchedIndexes } from "../../../utils/nearest-indexes";
import { CenterPoint } from "../../../../../points";

export function getStartIndexesTouchedBy(
  matrix: PolyMatrix, 
  callback: (value: CenterPoint | 'inner' | 'outer' | undefined) => boolean
): [number, number] {
  const {
    payload,
    topLeft: {params}
  } = matrix;
  
  const startI: number = 0;
  const startJ = payload[0].reduce((startJ, _value, j) => {
    if (startJ !== undefined) return startJ;

    const nearest = calcNearestAndTouchedIndexes(startI, j, params);
    const hasNearest = nearest.reduce((hasNearest, [i, j]) => {
      return hasNearest || (!!payload[i] && callback(payload[i][j]));
    }, false);

    return hasNearest ? j : startJ;
  }, undefined as undefined | number) as number;

  return [startI, startJ];
}
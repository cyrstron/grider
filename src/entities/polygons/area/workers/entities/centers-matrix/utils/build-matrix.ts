import { CenterPoint } from '../../../../../../points/center-point';

export function buildMatrix(
  centers: CenterPoint[],
  isAntimeridian: boolean,
) {
  centers = isAntimeridian ?
    centers.map((center) => center.toOppositeHemishpere()) :
    [...centers];

  const sortedByI = [...centers]
    .sort(({i: i1}, {i: i2}) => i1 - i2);
  const sortedByJ = [...centers]
    .sort(({j: j1}, {j: j2}) => j1 - j2);

  const {i: iMin} = sortedByI[0];
  const {i: iMax} = sortedByI[sortedByI.length - 1];
  const {j: jMin} = sortedByJ[0];
  const {j: jMax} = sortedByJ[sortedByJ.length - 1];

  const iDiff = iMax - iMin;
  const jDiff = jMax - jMin;

  const matrix = new Array(iDiff + 1)
    .fill(undefined)
    .map(
      () => new Array(jDiff + 1).fill(undefined),
    ) as Array<Array<CenterPoint | undefined>>;

  sortedByI.forEach((center) => {
    const i = center.i - iMin;
    const j = center.j - jMin;

    matrix[i][j] = isAntimeridian ?
      center.toOppositeHemishpere() :
      center;
  });

  return matrix;
}

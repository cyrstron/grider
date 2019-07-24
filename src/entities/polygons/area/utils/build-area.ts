import { CenterPoint } from "../../../points";

function isOnAntiMeridian(centers: CenterPoint[]): boolean {
  let eastern: CenterPoint = centers[0];
  let western: CenterPoint = centers[0];

  centers.forEach((center) => {
    if (center.isEasternTo(eastern)) {
      eastern = center;
    }

    if (center.isEasternTo(western)) {
      eastern = center;
    }
  });

  return eastern.isCloserThroughAntiMeridian(western);
}

function buildMatrix(centers: CenterPoint[]) {
  const isAntimeridian = isOnAntiMeridian(centers);

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

  const iDiff = iMax - iMin;

  const matrix = new Array(iDiff + 1)
    .fill(undefined)
    .map(() => []) as CenterPoint[][];

  sortedByI.forEach((center) => {
    const i = center.i - iMin;
    const j = center.j - jMin;

    matrix[i][j] = isAntimeridian ?
      center.toOppositeHemishpere() :
      center;
  });

  return matrix;
}

function getBiggestSet(
  centers: CenterPoint[]
) {
  const sets = [];
  const sorted = [...centers]
    .sort((centerA, centerB) => {
      const iDiff = centerA.i - centerB.i;

      return iDiff === 0 ?
        centerA.j - centerB.j :
        iDiff
    });

  
  // const setsByPoint = new Map<CenterPoint, CenterPoint[]>();
  // const sets: CenterPoint[][] = [];

  // matrix.forEach((row, i) => row.forEach(
  //   (centerA, j) => {
  //     if (!centerA) return;

  //     if (sets.length !== 0) {

  //       if (set) {
  //         set.push(centerA);
  //         return;
  //       } 
  //     }
            
  //     const set = [centerA];

  //     setsByPoint.set(centerA, set);
  //     sets.push(set);
  //   })
  // );

  // console.log(sets);
}

export function buildArea(centers: CenterPoint[]) {
  if (centers.length === 0) return [];
  if (centers.length === 1) return centers[0].toCell().points;

  const matrix = buildMatrix(centers);
  console.log(matrix);
  const biggestSet = getBiggestSet(centers);
}
import { CenterPoint } from "../../../points";
import { GridParams } from "../../../grid-params";

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
  const {j: jMax} = sortedByJ[sortedByJ.length - 1];

  const iDiff = iMax - iMin;
  const jDiff = jMax - jMin;

  const matrix = new Array(iDiff + 1)
    .fill(undefined)
    .map(
      () => new Array(jDiff + 1).fill(undefined)
    ) as Array<CenterPoint | undefined>[];

  sortedByI.forEach((center) => {
    const i = center.i - iMin;
    const j = center.j - jMin;

    matrix[i][j] = isAntimeridian ?
      center.toOppositeHemishpere() :
      center;
  });

  return matrix;
}

function unionNearestCenters(
  i: number,
  j: number, 
  matrix: Array<CenterPoint | undefined>[], 
  set?: Set<CenterPoint>
): Set<CenterPoint> {
  if (!set) {    
    set = new Set<CenterPoint>();
  }

  const point = matrix[i] && matrix[i][j];

  if (!point) return set;

  if (set.has(point)) return set;

  set.add(point);
  
  const indexes = calcNearestIndexes(i, j, point.params);

  indexes.forEach(([i, j]) => {
    unionNearestCenters(i, j, matrix, set);
  });

  return set;
}

function getBiggestSet(
  matrix: Array<CenterPoint | undefined>[]
) {  
  const sets = matrix.reduce((sets, row, i) => row.reduce(
    (sets, center, j) => {
      if (!center) return sets;

      if (sets.some((set) => set.has(center))) return sets;

      const set = unionNearestCenters(i, j, matrix);

      sets.push(set);

      return sets;
    }, sets), [] as Set<CenterPoint>[])
    .sort((setA, setB) => setB.size - setA.size);

  return sets[0];
}

function filterMatrixBySet(
  matrix: Array<CenterPoint | undefined>[], 
  set: Set<CenterPoint>
): Array<CenterPoint | undefined>[] {
  const filteredMatrix = matrix.map((row) => row.map(
    (point) => {
      return point && set.has(point) ? 
        point : 
        undefined;
    } 
  ))
    .filter((row) => !row.every(point => !point));

  const emptyColumnsIndexes: number[] = [];

  for (let i = 0; i < filteredMatrix[0].length; i += 1) {
    const isColumnEmpty = filteredMatrix.reduce((isColumnEmpty, row) => {
      if (!isColumnEmpty) return isColumnEmpty;

      return !row[i];
    }, true);

    if (isColumnEmpty) {
      emptyColumnsIndexes.push(i);
    }
  }

  return filteredMatrix.map((row) => row
    .filter((_center, index) => !emptyColumnsIndexes.includes(index))
  );
} 

export function buildArea(centers: CenterPoint[]) {
  if (centers.length === 0) return [];
  if (centers.length === 1) return centers[0].toCell().points;

  const matrix = buildMatrix(centers);
  console.log(matrix);
  const set = getBiggestSet(matrix);
  console.log(set);
  const filteredMatrix = filterMatrixBySet(matrix, set);
  console.log(filteredMatrix);
}

function calcNearestIndexes(
  i: number, 
  j: number, 
  params: GridParams
): number[][] {
  const indexes = [
    [i + 1, j],
    [i, j + 1],
    [i - 1, j],
    [i, j - 1],
  ];

  if (params.type !== 'hex') return indexes;

  indexes.push(
    [i - 1, j + 1],
    [i + 1, j - 1],
  );

  return indexes;
}
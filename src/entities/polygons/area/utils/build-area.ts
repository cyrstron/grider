import { CenterPoint } from "../../../points";

function buildMatrix(centers: CenterPoint[]) {
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

    matrix[i][j] = center;
  });

  return matrix;
}

function getBiggestSet(
  matrix: CenterPoint[][]
) {
  const setsByPoint = new Map<CenterPoint, CenterPoint[]>();
  const sets: CenterPoint[][] = [];

  matrix.forEach((row, rowIndex) => row.forEach(
    (centerA, cellIndex) => {
      if (!centerA) return;

      if (sets.length !== 0) {
        const prevNeighbors = [
          ...(matrix[rowIndex - 1] || [])
            .slice(cellIndex - 1, cellIndex + 2),
          matrix[rowIndex][cellIndex - 1],
        ]
          .filter((centerB) => centerB && centerB.isNeighbor(centerA));

        const neighbor = prevNeighbors[0];
        const set = setsByPoint.get(neighbor);

        if (set) {
          set.push(centerA);
          return;
        } 
      }
            
      const set = [centerA];

      setsByPoint.set(centerA, set);
      sets.push(set);
    })
  );

  console.log(sets);
}

export function buildArea(centers: CenterPoint[]) {
  if (centers.length === 0) return [];
  if (centers.length === 1) return centers[0].toCell().points;

  const matrix = buildMatrix(centers);
  console.log(matrix);
  const biggestSet = getBiggestSet(matrix);
}
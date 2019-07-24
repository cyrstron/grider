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

function removeEmptyRowsAndColumns(
  matrix: Array<CenterPoint | undefined>[]
): Array<CenterPoint | undefined>[] {
  const filtered = matrix.filter((row) => !row.every(point => !point));

  const emptyColumnsIndexes: number[] = [];

  for (let i = 0; i < filtered[0].length; i += 1) {
    const isColumnEmpty = filtered.reduce((isColumnEmpty, row) => {
      if (!isColumnEmpty) return isColumnEmpty;

      return !row[i];
    }, true);

    if (isColumnEmpty) {
      emptyColumnsIndexes.push(i);
    }
  }

  return filtered.map((row) => row
    .filter((_center, index) => !emptyColumnsIndexes.includes(index))
  );
}

function filterMatrixBySet(
  matrix: Array<CenterPoint | undefined>[], 
  set: Set<CenterPoint>
): Array<CenterPoint | undefined>[] {
  const matrixBySet = matrix.map((row) => row.map(
    (point) => {
      return point && set.has(point) ? 
        point : 
        undefined;
    } 
  ));

  return removeEmptyRowsAndColumns(matrixBySet);
} 

function getOuterCoords(
  matrix: Array<CenterPoint | undefined>[]
): number[][] {  
  const outerEmptinessIndexes: number[][] = [];

  const rowLength = matrix.length;
  const columnLength = matrix[0].length;

  const maxI = rowLength - 1;
  const maxJ = columnLength - 1;

  for (let j = 0; j < columnLength; j += 1) {
    outerEmptinessIndexes.push([0, j]);
  }

  for (let i = 0; i < rowLength; i += 1) {
    outerEmptinessIndexes.push([i, maxJ]);
  }

  for (let j = 0; j < columnLength; j += 1) {
    outerEmptinessIndexes.push([maxI, j]);
  }

  for (let i = 0; i < rowLength; i += 1) {
    outerEmptinessIndexes.push([i, 0]);
  }

  return outerEmptinessIndexes;
}

function getNearestEmpties(
  i: number,
  j: number,
  matrix: Array<CenterPoint | undefined>[],
  params: GridParams,
  emptiesCoords?: number[][],
): number[][] {
  if (!emptiesCoords) {
    emptiesCoords = [];
  }

  const hasPoint = !!emptiesCoords
    .find(([i2, j2]) => i === i2 && j === j2);

  if (hasPoint) return emptiesCoords;

  emptiesCoords.push([i, j]);

  const nearestEmptiesCords = calcNearestAndTouchedIndexes(i, j, params)
    .filter(([i, j]) => {
      if (!matrix[i]) return false;

      if (j < 0 || j >= matrix[0].length) return false;

      return !matrix[i][j];
    });

  nearestEmptiesCords.forEach(([i, j]) => {
    getNearestEmpties(i, j, matrix, params, emptiesCoords);
  });

  return emptiesCoords;
}

function getBorderEmpties(  
  matrix: Array<CenterPoint | undefined>[],
  params: GridParams,
): number[][] {
  const outerCoords = getOuterCoords(matrix);

  return outerCoords.reduce((borderEmpties, [i, j]) => {
    if (matrix[i][j]) return borderEmpties;

    const hasPoint = borderEmpties
      .some(([i2, j2]) => i === i2 && j === j2);

    if (hasPoint) return borderEmpties;

    const coords = getNearestEmpties(i, j, matrix, params);

    borderEmpties.push(...coords);

    return borderEmpties;
  }, [] as number[][]);
}

function getInnerEmpties(
  matrix: Array<CenterPoint | undefined>[],
  borderEmpties: number[][],
  params: GridParams,
) {
  return matrix.reduce((innerEmpties, row, i) => 
    row.reduce((innerEmpties, center, j) => {
      if (matrix[i][j]) return innerEmpties;

      const hasPoint = borderEmpties
        .some(([i2, j2]) => i === i2 && j === j2) ||
        innerEmpties.some(
          (empties) => empties.some(([i2, j2]) => i === i2 && j === j2)
        );

      if (hasPoint) return innerEmpties;

      const coords = getNearestEmpties(i, j, matrix, params);

      innerEmpties.push(coords);

      return innerEmpties;
    }, innerEmpties), 
  [] as number[][][]);
}

function getOuterCentersMatrix(
  matrix: Array<CenterPoint | undefined>[],
  borderEmpties: number[][],
  params: GridParams,
): Array<CenterPoint | undefined>[] {
  const maxI = matrix.length - 1;
  const maxJ = matrix[0].length - 1;

  return matrix.map((row, i) => row.map(
    (center, j) => {
      if (!center) return center;

      if (
        i === maxI ||
        j === maxJ ||
        i === 0 ||
        j === 0
      ) return center;

      const nearestEmpties = calcNearestAndTouchedIndexes(i, j, params)
        .filter(([i, j]) => {
          if (!matrix[i]) return false;

          if (j < 0 || j >= matrix[0].length) return false;

          return !matrix[i][j];
        });

      const isOnBorder = nearestEmpties.some(
        ([i1, j1]) => borderEmpties.some(([i2, j2]) => i1 === i2 && j1 === j2)
      );

      return isOnBorder ? center : undefined;
    })
  );
}

function getInnerCentersMatrixes(  
  matrix: Array<CenterPoint | undefined>[],
  innerEmpties: number[][][],
  params: GridParams,
): Array<CenterPoint | undefined>[][] {
  return innerEmpties.reduce((innerMatrixes, empties) => {
    const innerMatrix = matrix.map((row, i) => row.map(
      (center, j) => {
        if (!center) return center;
  
        const nearestEmpties = calcNearestAndTouchedIndexes(i, j, params)
          .filter(([i, j]) => {
            if (!matrix[i]) return false;
  
            if (j < 0 || j >= matrix[0].length) return false;
  
            return !matrix[i][j];
          });
  
        const isNearest = nearestEmpties.some(
          ([i1, j1]) => empties.some(([i2, j2]) => i1 === i2 && j1 === j2)
        );
  
        return isNearest ? center : undefined;
      })
    );

    const filtered = removeEmptyRowsAndColumns(innerMatrix);

    innerMatrixes.push(filtered);

    return innerMatrixes;
  }, [] as Array<CenterPoint | undefined>[][]);
}

export function buildArea(centers: CenterPoint[]) {
  if (centers.length === 0) return [];
  if (centers.length === 1) return centers[0].toCell().points;

  const params = centers[0].params;

  const matrix = buildMatrix(centers);
  const set = getBiggestSet(matrix);
  const filteredMatrix = filterMatrixBySet(matrix, set);
  const borderEmpties = getBorderEmpties(filteredMatrix, params);
  const innerEmpties = getInnerEmpties(filteredMatrix, borderEmpties, params);

  const outerMatrix = getOuterCentersMatrix(filteredMatrix, borderEmpties, params);
  const innerMatrixes = getInnerCentersMatrixes(filteredMatrix, innerEmpties, params);

  console.log(outerMatrix);
  console.log(innerMatrixes);
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

function calcNearestAndTouchedIndexes(
  i: number, 
  j: number, 
  params: GridParams
): number[][] {
  const indexes = [
    [i + 1, j],
    [i, j + 1],
    [i - 1, j],
    [i, j - 1],
    [i - 1, j + 1],
    [i + 1, j - 1],
  ];

  if (params.type !== 'rect') return indexes;

  indexes.push(
    [i + 1, j + 1],
    [i - 1, j - 1],
  );

  return indexes;
}
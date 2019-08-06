import { GeoPoint } from '../../../../points/geo-point';

export function cleanFigure(points: GeoPoint[]): GeoPoint[] {
  const indexes = indexatePoints(points);
  const {inner, outer} = calcSplitIndexes(indexes, points);
  const sliceIndexes = calcSliceIndexes(outer, inner);

  return clearPoints(points, sliceIndexes);
}

function indexatePoints(
  points: GeoPoint[],
): {[key: string]: number | number[]} {
  return points.reduce((
    indexes: {[key: string]: number | number[]},
    {lat, lng}: grider.GeoPoint,
    index: number,
  ): {[key: string]: number | number[]} => {
    const key = `${lat} ${lng}`;

    const value = indexes[key];

    if (value === undefined) {
      indexes[key] = index;
    } else if (Array.isArray(value)) {
      value.push(index);
    } else {
      indexes[key] = [value, index];
    }
    return indexes;
  }, {}) as {[key: string]: number | number[]};
}

function calcSplitIndexes(
  indexes: {[key: string]: number | number[]},
  points: GeoPoint[],
): {
  inner: number[][],
  outer: [number, number],
} {
  const pointsLength = points.length;

  return Object.keys(indexes)
  .reduce((
    repeatedPointIndexes: {
      inner: number[][],
      outer: [number, number],
    },
    key: string,
  ): {
    inner: number[][],
    outer: [number, number],
  } => {
    let indexValue = indexes[key];

    if (!Array.isArray(indexValue)) return repeatedPointIndexes;

    if (indexValue.length > 2) {
      indexValue = pickIndexes(indexValue, points.length);
    }

    const min = Math.min(...indexValue);
    const max = Math.max(...indexValue);

    const isOuter = (max - min > pointsLength + min - max) &&
      repeatedPointIndexes.outer[0] <= min &&
      repeatedPointIndexes.outer[1] >= max;

    if (isOuter) {
      repeatedPointIndexes.outer = [min, max];
      return repeatedPointIndexes;
    }

    let isNew = true;

    repeatedPointIndexes.inner.forEach((
      innerIndexes: number[],
      index: number,
    ) => {
      if (!isNew) return;

      const minInner = Math.min(...innerIndexes);
      const maxInner = Math.max(...innerIndexes);

      if (minInner > min && maxInner < max) {
        repeatedPointIndexes.inner[index] = [min, max];
      } else if (minInner < min && maxInner > max) {
        isNew = false;
      }
    });

    if (isNew) {
      repeatedPointIndexes.inner.push([min, max]);
    }

    return repeatedPointIndexes;
  }, {
    inner: [],
    outer: [0, pointsLength],
  });
}

function pickIndexes(indexes: number[], figureLength: number) {
  const picked = indexes.reduce((
    result: [number, number],
    indexValue,
    index,
  ): [number, number] => {
    const nextIndexValue = indexes[index + 1] || indexes[0];

    const resultMax = Math.max(result[0], result[1]);
    const resultMin = Math.min(result[0], result[1]);

    const resultDelta = Math.min(resultMax - resultMin, figureLength + resultMin - resultMax);

    const maxIndex = Math.max(indexValue, nextIndexValue);
    const minIndex = Math.min(indexValue, nextIndexValue);

    const indexDelta = Math.min(maxIndex - minIndex, figureLength + minIndex - maxIndex);

    return resultDelta > indexDelta ? result : [indexValue, nextIndexValue];
  }, [indexes[0], indexes[1]]);

  return picked;
}

function calcSliceIndexes(
  outer: number[],
  inner: number[][],
): Array<[number, number]> {
  return [
    ...outer,
    ...inner.reduce((
        indexes: number[],
        innerIndexes: number[],
      ): number[] => [...indexes, ...innerIndexes], []),
  ]
    .sort((a, b) => a - b)
    .reduce((
      sliceIndexes: Array<[number, number]>,
      sliceIndex: number,
      index: number,
      sortedIndexes: number[],
    ): Array<[number, number]> => {

      if (index % 2) return sliceIndexes;

      const nextIndex = sortedIndexes[index + 1];
      const startIndex = index === 0 ? sliceIndex : sliceIndex + 1;
      const endIndex = nextIndex + 1;

      sliceIndexes.push([startIndex, endIndex]);

      return sliceIndexes;
    }, []);
}

function clearPoints(
  points: GeoPoint[],
  sliceIndexes: Array<[number, number]>,
): GeoPoint[] {
  const clearedPoints = sliceIndexes.reduce((
    cleanedFigure: GeoPoint[],
    [sliceStart, sliceEnd]: [number, number],
  ) => [...cleanedFigure, ...points.slice(sliceStart, sliceEnd)], []);

  const firstPoint = clearedPoints[0];
  const lastPoint = clearedPoints[clearedPoints.length - 1];

  if (!lastPoint.isEqual(firstPoint)) {
    clearedPoints.push(firstPoint);
  }

  return clearedPoints;
}

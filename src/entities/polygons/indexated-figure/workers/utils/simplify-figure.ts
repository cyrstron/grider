import { GridParams } from '../../../../grid-params';
import { GeoPoint } from '../../../../points/geo-point';
import { GridPoint } from '../../../../points/grid-point';
import { GeoPolygon } from '../../../geo-polygon';

export function simplifyFigure(
  points: GeoPoint[],
  shape: GeoPolygon,
  params: GridParams,
) {
  if (params.type === 'hex') {
    return simplifyHexFigure(points, shape, params);
  } else {
    return simplifyRectFigure(points);
  }
}

function simplifyRectFigure(points: GeoPoint[]): GeoPoint[] {
  return points.filter((point, index) => {
    const prevPoint: grider.GeoPoint | undefined = points[index - 1];
    const nextPoint: grider.GeoPoint | undefined  = points[index + 1];

    if (!prevPoint || !nextPoint) return true;

    const arePointsAlike = [
      point.lat === prevPoint.lat || point.lng === prevPoint.lng,
      point.lat === nextPoint.lat || point.lng === nextPoint.lng,
      nextPoint.lat === prevPoint.lat || nextPoint.lng === prevPoint.lng,
    ];

    return !arePointsAlike.every((areAlike) => areAlike);
  });
}

function simplifyHexFigure(
  points: GeoPoint[],
  shape: GeoPolygon,
  params: GridParams,
): GeoPoint[] {
  if (points.length === 0) return points;

  if (params.type === 'rect') return points;

  const len = points.length;
  const isInner = shape.containsPoint(points[0]);

  const distances = points.map((point): number => shape.reduceSides((
      minDistance: number,
      side,
    ): number => {
      const distance = side.mercDistanceToPoint(point);

      return Math.min(distance, minDistance);
    }, Infinity),
  );

  const simplified = points.reduce((result: GeoPoint[], point, index) => {
    const prevIndex3: number = index - 3 < 0 ? index - 5 + len : index - 3;
    const prevIndex2: number = index - 2 < 0 ? index - 4 + len : index - 2;
    const prevIndex: number = index - 1 < 0 ? len - 2 : index - 1;

    const nextIndex: number = index + 1 > len - 1 ? 1 : index + 1;
    const nextIndex2: number = (index + 2) > (len - 1) ? index + 3 - len : index + 2;
    const nextIndex3: number = (index + 3) > (len - 1) ? index + 4 - len : index + 3;

    const segmentIndexes = [
      prevIndex2,
      prevIndex,
      index,
      nextIndex,
      nextIndex2,
      nextIndex3,
    ];

    let toBeAdded = checkPoint(points, distances, index, segmentIndexes, params, isInner);

    if (!toBeAdded) {
      const segmentIndexesEnsure = [
        nextIndex2,
        nextIndex,
        index,
        prevIndex,
        prevIndex2,
        prevIndex3,
      ];

      toBeAdded = checkPoint(points, distances, index, segmentIndexesEnsure, params, isInner);
    }

    if (toBeAdded) {
      result.push(point);
    }

    return result;
  }, []);

  const simpleLen = simplified.length;
  const simplifiedGrid = simplified.map((point) => GridPoint.fromGeo(point, params));

  const cleared = simplifiedGrid.reduce((
    cleared: GeoPoint[],
    point,
    index,
  ): GeoPoint[] => {
    const prevIndex = index === 0 ? simpleLen - 2 : index - 1;
    const nextIndex = index + 1 === simpleLen ? 1 : index + 1;
    const prevPoint = simplifiedGrid[prevIndex];
    const nextPoint = simplifiedGrid[nextIndex];

    if (!point.onSameAxis(prevPoint, nextPoint)) {
      cleared.push(simplified[index]);
    }

    return cleared;
  }, []);

  const clearedLen = cleared.length;

  if (!cleared[0].isEqual(cleared[clearedLen - 1])) {
    cleared.push(cleared[0]);
  }

  return cleared;
}

function checkPoint(
  figure: GeoPoint[],
  distances: number[],
  index: number,
  segmentIndexes: number[],
  params: GridParams,
  isInner: boolean,
): boolean {
  const pointDistance = distances[index];

  let segment = segmentIndexes.map((index) => figure[index]);

  const lngs = segment.map(({lng}) => lng);
  const lngMin = Math.min(...lngs);
  const lngMax = Math.max(...lngs);
  const isRipped = lngMax - lngMin > 180;

  if (isRipped) {
    segment = segment.map((point) => point.toOppositeHemisphere());
  }

  const gridSegment = segment.map((point) => GridPoint.fromGeo(point, params));

  const pointsInRow = gridSegment.reduce((
    pointsInRow: number[][],
    pointA,
    indexA,
  ) => {
    return gridSegment.reduce((
      pointsInRow: number[][],
      pointB,
      indexB,
    ) => {
      if (indexA >= indexB) return pointsInRow;

      const startPoint = pointA;
      const endPoint = pointB;

      gridSegment.forEach((point, index) => {
        if (index === indexA || index === indexB) return;

        if (point.onSameAxis(startPoint, endPoint)) {
          pointsInRow.push(
            [indexA, indexB, index]
              .sort((a, b) => a - b)
              .map((index) => segmentIndexes[index]),
          );
        }
      });

      return pointsInRow;
    }, pointsInRow);
  }, []);

  let toBeAdded;

  if (pointsInRow.length === 0) {
    return true;
  } else if (pointsInRow.length > 1 && pointsInRow.every((row) => row.includes(index))) {

    const outOfRowIndexes = segmentIndexes.filter(
      (index) => pointsInRow.every((row) => !row.includes(index)),
    );

    if (outOfRowIndexes.length !== 1) return true;

    const isPointFurther = pointDistance < distances[outOfRowIndexes[0]];

    return isPointFurther === isInner;
  } else {
    toBeAdded = pointsInRow
      .reduce((toBeAdded: boolean, row): boolean => {
        if (toBeAdded) return toBeAdded;

        if (row.includes(index)) {
          return false;
        }

        const testPointIndex = row[1];
        const isPointFurther = pointDistance < distances[testPointIndex];

        return isPointFurther === isInner;
      }, false);

    return toBeAdded;
  }
}

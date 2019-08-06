import { GridParams } from '../../../../grid-params';
import { GeoPoint } from '../../../../points/geo-point';
import { PeakPoint } from '../../../../points/peak-point';
import { GeoSegment } from '../../../../segments/geo-segment';
import { Cell } from '../../../cell';
import { GeoPolygon } from '../../../geo-polygon/geo-polygon';

function checkStartPoint(
  shape: GeoPolygon,
  peak: PeakPoint,
  prevPeak?: PeakPoint,
): boolean {
  const okPoints = peak.nearestNotSeparatedByPoly(shape);

  const {length} = okPoints;

  if (length === 1) {
    return checkStartPoint(shape, okPoints[0], peak);
  } else if (prevPeak) {
    return length > 1;
  } else {
    return okPoints.map((okPeak) => checkStartPoint(shape, okPeak, peak))
    .some((isValid) => isValid);
  }
}

function findFirstPointOfAllCellPoints(
  shape: GeoPolygon,
  startCell: Cell,
  isInner: boolean,
): GeoPoint | undefined {
  const shapeSide = shape.sideByIndex(0);
  const lastShapeIndex = shape.points.length - 1;
  const prevShapeSide = shape.sideByIndex(lastShapeIndex);

  return startCell.reduceSides((
    firstPoint: GeoPoint | undefined,
    cellSide,
  ): GeoPoint | undefined => {
    if (firstPoint) return firstPoint;

    const intersectA = cellSide.intersectionPoint(shapeSide);
    const intersectB = cellSide.intersectionPoint(prevShapeSide);

    if (!intersectA || !intersectB) return firstPoint;

    const {pointA, pointB} = cellSide;

    const distanceA = pointA.calcMercDistance(intersectA);
    const distanceB = pointA.calcMercDistance(intersectB);

    return isInner === distanceA > distanceB ? pointB : pointA;
  }, undefined);
}

function findFirstPointOfSomeCellPoints(
  shape: GeoPolygon,
  startCell: Cell,
  points: GeoPoint[],
  isInner: boolean,
): GeoPoint | undefined {
  const shapeSide = shape.sideByIndex(0);
  const {params} = startCell.center;
  const nextCell = startCell.nextCellOnSegment(shapeSide) ||
    Cell.fromGeoPoint(shape.points[1], params);

  const firstPoint = points.find((
    point,
  ) => {
    const pointIndex = startCell.points.indexOf(point);
    const prevPoint = startCell.prevPointByIndex(pointIndex);
    const nextPoint = startCell.nextPointByIndex(pointIndex);

    const prevContained = shape.containsPoint(prevPoint);
    const nextContained = shape.containsPoint(nextPoint);

    return prevContained !== nextContained &&
      !nextCell.points.find((nextPoint) => nextPoint.isEqual(point));
  });

  if (!firstPoint) return;

  const peak = PeakPoint.fromGeo(firstPoint, params);
  const isPointValid = checkStartPoint(shape, peak);

  return isPointValid ? firstPoint : undefined;
}

function findFirstPointForCell(
  startCell: Cell,
  shape: GeoPolygon,
  params: GridParams,
  isInner: boolean = true,
): GeoPoint | undefined {
  const points = isInner ?
    startCell.pointsInsidePoly(shape) :
    startCell.pointsOutsidePoly(shape);

  if (points.length === 0) return;

  if (points.length === 1) {
    const peak = PeakPoint.fromGeo(points[0], params);

    return checkStartPoint(shape, peak) ? points[0] : undefined;
  }

  if (points.length === startCell.points.length) {
    return findFirstPointOfAllCellPoints(shape, startCell, isInner);
  }

  return findFirstPointOfSomeCellPoints(shape, startCell, points, isInner);
}

export function findStartPointForSide(
  shapeSide: GeoSegment,
  shape: GeoPolygon,
  params: GridParams,
  isInner: boolean,
): GeoPoint | undefined {
  const endCell = Cell.fromGeoPoint(shapeSide.pointB, params);
  let startCell: Cell | undefined = Cell.fromGeoPoint(shape.points[0], params);

  if (!startCell) return;

  let firstPoint: GeoPoint | undefined;

  while (startCell && (!firstPoint || !startCell.isEqual(endCell))) {
    firstPoint = findFirstPointForCell(startCell, shape, params, isInner);

    if (firstPoint) break;

    startCell = startCell.nextCellOnSegment(shapeSide);
  }

  return firstPoint;
}

export function recalcStartCell(
  points: GeoPoint[],
  shapeSide: GeoSegment,
  params: GridParams,
): Cell | undefined {
  const lastPoint = points[points.length - 1];
  const endCell = Cell.fromGeoPoint(shapeSide.pointB, params);

  let startCell: Cell | undefined = Cell.fromGeoPoint(shapeSide.pointA, params);
  let startPoint: GeoPoint | undefined = startCell.findEqualGeoPoint(lastPoint);

  if (startPoint) return startCell;

  while (!startPoint && startCell && !startCell.isEqual(endCell)) {
    startCell = startCell.nextCellOnSegment(shapeSide);

    if (!startCell) break;

    const preLastPoint = points[points.length - 2];
    const containsPrelast = !!preLastPoint && !!startCell.findEqualGeoPoint(preLastPoint);

    if (containsPrelast) continue;

    startPoint = startCell.findEqualGeoPoint(lastPoint);
  }

  return startCell;
}

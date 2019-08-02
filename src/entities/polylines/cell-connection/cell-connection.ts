import { CenterPoint } from '../../points/center-point';
import { GeoPoint } from '../../points/geo-point';
import { Cell } from '../../polygons/cell';
import { GeoSegment } from '../../segments';

export class CellConnection {

  static fromCenters(
    centerA: CenterPoint,
    centerB: CenterPoint,
  ): CellConnection {
    const geoPointA = centerA.toGeo();
    const geoPointB = centerB.toGeo();
    const endCell = Cell.fromCenter(centerB);
    const innerCenters = [];
    const points = [geoPointA];

    let segment = new GeoSegment(geoPointA, geoPointB);
    let nextCell: Cell | undefined = Cell.fromCenter(centerA).nextCellOnSegment(segment);

    while (nextCell && !nextCell.isEqual(endCell)) {
      const nextGeoPoint = nextCell.center.toGeo();

      segment = new GeoSegment(nextGeoPoint, geoPointB);

      innerCenters.push(nextCell.center);
      points.push(nextGeoPoint);

      nextCell = nextCell.nextCellOnSegment(segment);
    }

    points.push(geoPointB);

    return new CellConnection(centerA, centerB, points, innerCenters);
  }

  constructor(
    public centerA: CenterPoint,
    public centerB: CenterPoint,
    public path: GeoPoint[],
    public innerCenters: CenterPoint[],
  ) {}
}

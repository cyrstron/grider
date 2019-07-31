import { GeoPoint, CenterPoint } from "../../points";
import { GeoSegment } from "../../segments";
import { Cell } from "../../polygons";

export class CellConnection {
  constructor(
    public centerA: CenterPoint,
    public centerB: CenterPoint,
    public path: GeoPoint[],
    public innerCenters: CenterPoint[]
  ) {}

  static fromCenters(
    centerA: CenterPoint, 
    centerB: CenterPoint
  ): CellConnection {
    const geoPointA = centerA.toGeo();
    const geoPointB = centerB.toGeo();
    const endCell = centerB.toCell();
    const innerCenters = [];
    const points = [geoPointA];

    let segment = new GeoSegment(geoPointA, geoPointB);
    let nextCell: Cell | undefined = centerA.toCell().nextCellOnSegment(segment);
    
    while(nextCell && !nextCell.isEqual(endCell)) {
      const nextGeoPoint = nextCell.center.toGeo();

      segment = new GeoSegment(nextGeoPoint, geoPointB);

      innerCenters.push(nextCell.center);
      points.push(nextGeoPoint);      

      nextCell = nextCell.nextCellOnSegment(segment);
    }

    points.push(geoPointB);

    return new CellConnection(centerA, centerB, points, innerCenters);
  }
}
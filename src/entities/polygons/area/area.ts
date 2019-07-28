import { GeoPoint, CenterPoint } from "../../points";
import { GeoPolygon } from "../geo-polygon";

import {buildArea} from './utils/build-area';

export class Area extends GeoPolygon {
  constructor(
    points: GeoPoint[],
    public holes: GeoPoint[][],
    public centers: CenterPoint[]
  ) {
    super(points);
  }

  static fromCellCenters(centers: CenterPoint[]): Area {
    const [points, ...holes] = buildArea(centers);

    return new Area(points, holes, centers);
  }
}
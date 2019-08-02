import { CenterPoint } from '../../points/center-point';
import { GeoPoint } from '../../points/geo-point';
import { GeoPolygon } from '../geo-polygon';

import {buildArea} from './utils/build-area';

export class Area extends GeoPolygon {

  static fromCellCenters(centers: CenterPoint[]): Area {
    const polys = buildArea(centers);

    return new Area(polys[0], polys, centers);
  }
  constructor(
    points: GeoPoint[],
    public polys: GeoPoint[][],
    public centers: CenterPoint[],
  ) {
    super(points);
  }
}

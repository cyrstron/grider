// import { grider } from '../..';

export class NoneCorrector {
  correctForGrid(point: grider.GeoPoint): grider.GeoPoint {
    return point;
  }

  correctForGeo(point: grider.GeoPoint): grider.GeoPoint {
    return point;
  }

  correctPoly(poly: grider.GeoPoint[]): grider.GeoPoint[] {
    return poly;
  }
}

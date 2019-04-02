import { GeographyUtils, GriderUtils } from '../../utils';

export class NoneCorrector {
  geography: GeographyUtils;
  constructor({geography}: GriderUtils) {
    this.geography = geography;
  }

  correctForGrid(point: grider.GeoPoint): grider.GeoPoint {
    return point;
  }

  correctForGeo(
    point: grider.GeoPoint,
    ): grider.GeoPoint {
    return this.geography.formatGeoPoint(point);
  }

  correctPoly(poly: grider.GeoPoint[]): grider.GeoPoint[] {
    return poly;
  }
}

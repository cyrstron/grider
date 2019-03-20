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
    gridParams: grider.GridParams,
    ): grider.GeoPoint {
    return this.geography.formatGeoPoint(point, gridParams.crop);
  }

  correctPoly(poly: grider.GeoPoint[]): grider.GeoPoint[] {
    return poly;
  }
}

import { Grider } from './grider';

export class StaticGrider {
  grider: Grider;
  params: grider.GridParams;

  constructor(
    grider: Grider,
    params: grider.GridParams,
  ) {
    this.grider = grider;
    this.params = params;
  }

  buildPolyByGeoPoint(geoPoint: grider.GeoPoint): grider.GeoPoint[] {
    return this.grider.buildPolyByGeoPoint(
      geoPoint,
      this.params,
    );
  }

  buildPolyByCenterGridPoint(
    centerGridPoint: grider.PointHex | grider.PointRect,
  ): grider.GeoPoint[] {
    return this.grider.buildPolyByCenterGridPoint(
      centerGridPoint,
      this.params,
    );
  }

  calcGridCenterPointByGeoPoint(
    geoPoint: grider.GeoPoint,
  ): grider.PointHex | grider.PointRect {
    return this.grider.calcGridCenterPointByGeoPoint(
      geoPoint,
      this.params,
    );
  }
}

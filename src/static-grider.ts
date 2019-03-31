import { FigureBuilder } from './figure-builder';
import { Grider } from './grider';

export class StaticGrider {
  grider: Grider;
  figureBuilder: FigureBuilder;
  params: grider.GridParams;

  constructor(
    grider: Grider,
    figureBuilder: FigureBuilder,
    params: grider.GridParams,
  ) {
    this.grider = grider;
    this.figureBuilder = figureBuilder;
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

  buildOuterFigure(poly: grider.GeoPoint[]): grider.GeoPoint[] {
    return this.figureBuilder.buildOuterFigure(poly, this.params);
  }
  buildInnerFigure(poly: grider.GeoPoint[]): grider.GeoPoint[] {
    return this.figureBuilder.buildInnerFigure(poly, this.params);
  }
}

import { CenterCalculator } from './center-calc';
import { Converter } from './converter';
import { ShapeBuilder } from './shape-builder';

export class Grider {
  builder: ShapeBuilder;
  centerCalc: CenterCalculator;
  converter: Converter;

  constructor({
    builder,
    centerCalc,
    converter,
  }: {
    builder: ShapeBuilder,
    centerCalc: CenterCalculator,
    converter: Converter,
  }) {
    this.builder = builder;
    this.centerCalc = centerCalc;
    this.converter = converter;
  }

  buildPolyByGeoPoint(
    geoPoint: grider.GeoPoint,
    gridParams: grider.GridParams,
  ): grider.GeoPoint[] {
    const centerGridPoint = this.calcGridCenterPointByGeoPoint(
      geoPoint,
      gridParams,
    );

    return this.buildPolyByCenterGridPoint(
      centerGridPoint,
      gridParams,
    );
  }

  buildPolyByCenterGridPoint(
    centerGridPoint: grider.PointHex | grider.PointRect,
    gridParams: grider.GridParams,
  ): grider.GeoPoint[] {
    const gridShape: Array<
      grider.PointHex | grider.PointRect
    > = this.builder.build(centerGridPoint, gridParams.type);

    const geoShape = gridShape.map((
      gridPoint: grider.PointHex | grider.PointRect,
      ): grider.GeoPoint => this.converter.toGeo(gridPoint, gridParams),
    );

    return geoShape;
  }

  calcGridCenterPointByGeoPoint(
    geoPoint: grider.GeoPoint,
    gridParams: grider.GridParams,
  ): grider.PointHex | grider.PointRect {
    const gridPoint = this.converter.toGrid(geoPoint, gridParams);
    const centerGridPoint = this.centerCalc.round(
      gridPoint,
      gridParams.type,
    );

    return centerGridPoint;
  }

  calcGeoPointByGridPoint(
    gridPoint: grider.PointHex | grider.PointRect,
    gridParams: grider.GridParams,
  ): grider.GeoPoint {
    const geoPoint = this.converter.toGeo(gridPoint, gridParams);

    return geoPoint;
  }

}

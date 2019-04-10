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
  ): grider.GridPoint {
    const gridPoint = this.converter.toGrid(geoPoint, gridParams);
    const centerGridPoint = this.centerCalc.round(
      gridPoint,
      gridParams.type,
    );

    return this.reducePoint(centerGridPoint, gridParams);
  }

  reducePoint(
    gridPoint: grider.GridPoint,
    gridParams: grider.GridParams,
  ): grider.GridPoint {
    const reducedGeoPoint = this.converter.toGeo(gridPoint, gridParams);

    const reducedCenterPoint = this.converter.toGrid(reducedGeoPoint, gridParams);

    return this.centerCalc.round(
      reducedCenterPoint,
      gridParams.type,
    );
  }

  calcGeoPointByGridPoint(
    gridPoint: grider.GridPoint,
    gridParams: grider.GridParams,
  ): grider.GeoPoint {
    const geoPoint = this.converter.toGeo(gridPoint, gridParams);

    return geoPoint;
  }

  calcGridPointByGeoPoint(
    geoPoint: grider.GeoPoint,
    gridParams: grider.GridParams,
  ): grider.GridPoint {
    const gridPoint = this.converter.toGrid(geoPoint, gridParams);

    return gridPoint;
  }
}

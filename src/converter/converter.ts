import { AxisTransformer } from './axis-transformer';
import { Corrector } from './corrector';

export class Converter {
  axisTransformer: AxisTransformer;
  corrector: Corrector;

  constructor(axisTransformer: AxisTransformer, corrector: Corrector) {
    this.axisTransformer = axisTransformer;
    this.corrector = corrector;
  }

  toGrid(
    geoPoint: grider.GeoPoint,
    gridParams: grider.GridParams,
  ): grider.PointHex | grider.PointRect {
    const correctedGeoPoint = this.corrector.correctForGrid(geoPoint, gridParams);
    const {
      axes: axesParams,
      type,
    } = gridParams;

    const gridPoint = axesParams.reduce((gridPoint: any, axisParams: grider.GridAxis) => {
      gridPoint[axisParams.name] = this.axisTransformer.toGrid(correctedGeoPoint, axisParams, gridParams);

      return gridPoint;
    }, {});

    if (type === 'hex') {
      return gridPoint as grider.PointHex;
    } else {
      return gridPoint as grider.PointRect;
    }
  }

  toGeo(
    gridPoint: grider.PointHex | grider.PointRect,
    gridParams: grider.GridParams,
  ): grider.GeoPoint {
    const {
      geoAxes: axesParams,
    } = gridParams;

    const geoPoint = axesParams
      .reduce((geoPoint: grider.GeoPoint, axisParams: grider.Axis) => {
        geoPoint[axisParams.name] = this.axisTransformer.toGeo(gridPoint, axisParams, gridParams);

        return geoPoint;
      }, {} as grider.GeoPoint);

    return this.corrector.correctForGeo(geoPoint, gridParams);
  }
}

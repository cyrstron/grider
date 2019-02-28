import { AxisRotator } from './rotator';
import { AxisScaler } from './scaler';

export class AxisTransformer {
  rotator: AxisRotator;
  scaler: AxisScaler;
  constructor(rotator: AxisRotator, scaler: AxisScaler) {
    this.rotator = rotator;
    this.scaler = scaler;
  }

  toGrid(
    point: grider.GeoPoint,
    axisParams: grider.GridAxis,
    gridParams: grider.GridParams,
  ) {
    const rotatedAxis = this.rotator.rotateToGrid(point, axisParams, gridParams.isHorizontal);
    const scaledAxis = this.scaler.toGridScale(rotatedAxis, gridParams);

    return scaledAxis;
  }

  toGeo(
    point: grider.PointHex | grider.PointRect,
    axisParams: grider.Axis,
    gridParams: grider.GridParams,
  ) {
    const rotatedAxis = this.rotator.rotateToGeo(point, axisParams, gridParams.isHorizontal);
    const scaledAxis = this.scaler.toGeoScale(rotatedAxis, gridParams);

    return scaledAxis;
  }
}

import { GriderUtils, MathUtils } from '../../utils';

export class AxisRotator {
  math: MathUtils;

  constructor({math}: GriderUtils) {
    this.math = math;
  }

  rotateToGrid(
    point: grider.GeoPoint,
    axisParams: grider.GridAxis,
    isHorizontal: boolean,
  ): number {
    const mainAxis = isHorizontal ? 'lng' : 'lat';
    const auxAxis = isHorizontal ? 'lat' : 'lng';

    const main = point[mainAxis];
    const aux = point[auxAxis];

    const angle = axisParams.angle;
    const sin = this.math.sinDeg(angle);
    const cos = this.math.cosDeg(angle);

    const axisValue = aux * sin + main * cos;

    return axisValue;
  }

  rotateToGeo(
    point: grider.PointHex | grider.PointRect,
    axisParams: grider.Axis,
    isHorizontal: boolean,
  ): number {
    const mainAxis = isHorizontal ? 'lng' : 'lat';
    const auxAxis = isHorizontal ? 'lat' : 'lng';

    const angle = axisParams.angle;
    const sin = this.math.sinDeg(angle);
    const cos = this.math.cosDeg(angle);

    let axis;

    switch (axisParams.name) {
      case mainAxis:
        axis = (point.i - point.j * sin) / cos;
        break;
      case auxAxis:
        axis = (point.j - point.i * cos) / sin;
        break;
      default:
        axis = point.j * sin + point.i * cos;
        break;
    }

    return axis;
  }
}

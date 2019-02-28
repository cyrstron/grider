import { GriderUtils, PointUtils } from './utils';

export class CenterCalculator {
  pointUtils: PointUtils;

  constructor(utils: GriderUtils) {
    this.pointUtils = utils.point;
  }

  round(
    gridPoint: grider.PointHex | grider.PointRect,
    type: grider.ShapeType,
  ): grider.PointHex | grider.PointRect {
    if (type === 'hex') {
      return this.pointUtils.roundHexGridPoint(
        gridPoint as grider.PointHex,
      );
    } else {
      return this.pointUtils.roundRectGridPoint(
        gridPoint,
      );
    }
  }
}

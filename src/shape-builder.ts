import { GeometryUtils, GriderUtils } from './utils';

export class ShapeBuilder {
  geometry: GeometryUtils;

  constructor(utils: GriderUtils) {
    this.geometry = utils.geometry;
  }

  build(
    gridCenterPoint: grider.PointHex | grider.PointRect,
    type: grider.ShapeType,
  ): grider.GridHexagon | grider.GridRectangle {
    if (type === 'hex') {
      return this.geometry.getHexGridPolyPoints(
        gridCenterPoint as grider.PointHex,
      ) as grider.GridHexagon;
    } else {
      return this.geometry.getRectGridPolyPoints(
        gridCenterPoint,
      ) as grider.GridRectangle;
    }
  }
}

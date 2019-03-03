import { Grider } from '../grider';

export class FigureBuilder {
  constructor(public grider: Grider) {}

  buildFigure(
    shape: grider.GeoPoint[],
    gridParams: grider.GridParams,
  ): grider.GeoPoint[] {
    const correctedShape = shape.map(
      (geoPoint) => {
        const centerPoint = this.grider.calcGridCenterPointByGeoPoint(geoPoint, gridParams);

        return this.grider.calcGeoPointByGridPoint(centerPoint, gridParams);
      },
    );

    return correctedShape;
  }
}

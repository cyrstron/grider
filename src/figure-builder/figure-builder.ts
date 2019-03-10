import { Grider } from '../grider';
import { GriderUtils } from '../utils';

export class FigureBuilder {
  constructor(
    public grider: Grider,
    public utils: GriderUtils,
  ) {}

  buildInnerFigure(
    shape: grider.GeoPoint[],
    gridParams: grider.GridParams,
  ): grider.GeoPoint[] {
    const figure: grider.GeoPoint[] = [];
    // const correctedShape = shape.map(
    //   (geoPoint) => {
    //     const centerPoint = this.grider.calcGridCenterPointByGeoPoint(geoPoint, gridParams);
    //     const geoPoly = this.grider.buildPolyByCenterGridPoint(centerPoint, gridParams);
    //     const firstPoint = geoPoly.reduce((
    //       firstPoint: grider.GeoPoint,
    //       point: grider.GeoPoint): grider.GeoPoint => {
    //       const isContain = this.utils.geometry.polyContains(shape, point);

    //     }, geoPoly[0]);
    //   },
    // );

    return shape;
  }

  buildFigure(
    shape: grider.GeoPoint[],
    gridParams: grider.GridParams,
  ): grider.GeoPoint[] {
    const figure: grider.GeoPoint[] = [];
    // const correctedShape = shape.map(
    //   (geoPoint) => {
    //     const centerPoint = this.grider.calcGridCenterPointByGeoPoint(geoPoint, gridParams);
    //     const geoPoly = this.grider.buildPolyByCenterGridPoint(centerPoint, gridParams);
    //     const firstPoint = geoPoly.reduce((
    //       firstPoint: grider.GeoPoint,
    //       point: grider.GeoPoint): grider.GeoPoint => {
    //       const isContain = this.utils.geometry.polyContains(shape, point);

    //     }, geoPoly[0]);
    //   },
    // );

    return shape;
  }
//   getFirstPoint(
//     shape: grider.GeoPoint[],
//     gridParams: grider.GridParams,
//   ): grider.GeoPoint {
//     let contains: boolean[] = [];
//     const gridCenter: grider.PointRect | grider.PointHex = this.grider
//       .calcGridCenterPointByGeoPoint(shape[0], gridParams);
//     const geoPoly: grider.GeoPoint[] = this.grider.buildPolyByCenterGridPoint(gridCenter, gridParams);

//     while (contains.every((isContained) => isContained === contains[0])) {
//       contains = geoPoly.map((
//         geoPoint: grider.GeoPoint,
//       ): boolean => this.utils.geometry.polyContains(shape, geoPoint));
//     }

//     let firstPoint: grider.GeoPoint | undefined;

//     while (!firstPoint) {
//       }, undefined;)
//     }

// return firstPoint;
//   }

// getNextGridCenter(
//     shape: grider.GeoPoint[],
//     gridCenter: grider.PointRect | grider.PointHex,
//     gridParams: grider.GridParams,
//   ); : grider.PointRect | grider.PointHex; {

//     const geoPoly = this.grider.buildPolyByCenterGridPoint(centerPoint, gridParams);
//     const firstPoint = geoPoly.reduce((
//       firstPoint: grider.GeoPoint,
//       point: grider.GeoPoint): grider.GeoPoint => {
//       const isContain = this.utils.geometry.polyContains(shape, point);
//   };
}

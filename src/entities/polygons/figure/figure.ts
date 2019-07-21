import {GeoPolygon} from '../geo-polygon/geo-polygon';
import { GridParams } from '../../grid-params';
import { GeoPoint } from '../../points/geo-point';

import {buildFigurePoints} from './utils/calc-figure-points';

export class Figure extends GeoPolygon {
  constructor(
    points: GeoPoint[],
    public shape: GeoPolygon,
    public params: GridParams,
    public isInner: boolean,
  ) {
    super(points);
  }

  static fromShape(shape: GeoPolygon, params: GridParams, isInner: boolean = true) {
    const figurePoints = buildFigurePoints(shape, params, isInner);
    const points = figurePoints;

    return new Figure(
      points,
      shape,
      params,
      isInner,
    );
  }
}
import {GeoPolygon} from '../geo-polygon/geo-polygon';
import { GridParams } from '../../grid-params';

import {buildFigurePoints} from './utils/calc-figure-points';

export class Figure extends GeoPolygon {
  shape: GeoPolygon;
  params: GridParams;
  isInner: boolean;
  simplifiedPoints: GeoPolygon;

  constructor(shape: GeoPolygon, params: GridParams, isInner: boolean) {
    const points = buildFigurePoints(shape, params, isInner);

    super(points);

    this.shape = shape;
    this.params = params;
    this.isInner = isInner;
  }
}
import {GeoPolygon} from '../geo-polygon/geo-polygon';
import { GridParams } from '../../grid-params';

import {buildFigurePoints} from './utils/calc-figure-points';
import {simplifyFigure} from './utils/simplify-figure';

export class Figure extends GeoPolygon {
  shape: GeoPolygon;
  params: GridParams;
  isInner: boolean;
  fullPoints: GeoPolygon;

  constructor(shape: GeoPolygon, params: GridParams, isInner: boolean) {
    const fullPoints = buildFigurePoints(shape, params, isInner);
    const points = simplifyFigure(fullPoints, shape, params);

    super(points);

    this.fullPoints = new GeoPolygon(fullPoints);
    this.shape = shape;
    this.params = params;
    this.isInner = isInner;
  }
}
import {GeoPolygon} from '../geo-polygon/geo-polygon';
import { GridParams } from '../../grid-params';
import { GeoPoint } from '../../points/geo-point';
import {Indexation} from './entities/indexation';

import {buildFigurePoints} from './utils/calc-figure-points';
import {simplifyFigure} from './utils/simplify-figure';

export class Figure extends GeoPolygon {
  constructor(
    points: GeoPoint[],
    public shape: GeoPolygon,
    public params: GridParams,
    public isInner: boolean,
    public fullPoints: GeoPolygon,
    public indexation: Indexation,
  ) {
    super(points);
  }

  fromShape(shape: GeoPolygon, params: GridParams, isInner: boolean) {
    const figurePoints = buildFigurePoints(shape, params, isInner);
    const points = simplifyFigure(figurePoints, shape, params);
    const fullPoints = new GeoPolygon(figurePoints);
    const indexation = Indexation.fromPoints(points);

    return new Figure(
      points,
      shape,
      params,
      isInner,
      fullPoints,
      indexation,
    );
  }
}
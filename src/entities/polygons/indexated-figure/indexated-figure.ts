import {Figure} from '../figure';
import { GeoPolygon } from '../geo-polygon';
import { GridParams } from '../../grid-params';
import { GeoPoint, TileMercPoint, Point } from '../../points';
import { Indexation } from './entities/indexation';
import { simplifyFigure } from './utils/simplify-figure';

export class IndexatedFigure extends Figure {
  fullPoints: GeoPolygon;
  indexation: Indexation;

  constructor(    
    points: GeoPoint[],
    shape: GeoPolygon,
    params: GridParams,
    isInner: boolean,
    fullPoints: GeoPolygon,
    indexation: Indexation,
  ) {
    super(points, shape, params, isInner);

    this.fullPoints = fullPoints;
    this.indexation = indexation;
  }

  tilePoints(tilePoint: TileMercPoint): Point[] {
    if (this.points.length === 0) return [];

    const points = this.indexation.tileBorderPoints(tilePoint);

    return points;
  }

  static fromShape(
    shape: GeoPolygon, 
    params: GridParams, 
    isInner: boolean = true
  ): IndexatedFigure {
    const {points: fullPoints} = Figure.fromShape(shape, params, isInner);

    const points = simplifyFigure(fullPoints, shape, params);
    const indexation = Indexation.fromPoints(points);

    return new IndexatedFigure(
      points, 
      shape, 
      params, 
      isInner, 
      new GeoPolygon(fullPoints), 
      indexation
    );
  }
}
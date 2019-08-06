import { GridParams } from '../../grid-params';
import { GeoPoint } from '../../points/geo-point';
import { TileMercPoint } from '../../points/tile-merc-point';
import {Figure} from '../figure';
import {GeoPolygon} from '../geo-polygon';
import {Point} from '../../points';
import {IndexationWorker} from './utils/indexation-worker';

export class IndexatedFigure extends Figure {
  static indexWorker?: IndexationWorker;

  static async fromShape(
    shape: GeoPolygon,
    params: GridParams,
    isInner: boolean = true,
  ): Promise<IndexatedFigure> {
    if (!IndexatedFigure.indexWorker) {
      IndexatedFigure.indexWorker = new IndexationWorker();
    }

    const {points: fullPoints} = await Figure.fromShape(shape, params, isInner);

    const simplifiedPoints = await IndexatedFigure.indexWorker.indexatePoints(fullPoints, shape, params);

    return new IndexatedFigure(
      simplifiedPoints as GeoPoint[],
      shape,
      params,
      isInner,
      new GeoPolygon(fullPoints),
    );
  }

  fullPoints: GeoPolygon;

  constructor(
    points: GeoPoint[],
    shape: GeoPolygon,
    params: GridParams,
    isInner: boolean,
    fullPoints: GeoPolygon,
  ) {
    super(points, shape, params, isInner);

    this.fullPoints = fullPoints;
  }

  async tilePoints(tilePoint: TileMercPoint): Promise<Point[]> {
    if (this.points.length === 0) return [];

    if (!IndexatedFigure.indexWorker) return [];

    const points = await IndexatedFigure.indexWorker.buildTile(tilePoint);

    return points;
  }
}

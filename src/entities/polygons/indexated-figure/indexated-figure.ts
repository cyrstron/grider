import { GridParams } from '../../grid-params';
import { GeoPoint } from '../../points/geo-point';
import { TileMercPoint } from '../../points/tile-merc-point';
import {Figure} from '../figure';
import {GeoPolygon} from '../geo-polygon';
import {WorkerService} from '../../../services/worker-service';
import {Point} from '../../points';

import Worker from './workers/border-indexation.worker';

export class IndexatedFigure extends Figure {

  static worker?: WorkerService<any>;

  static async fromShape(
    shape: GeoPolygon,
    params: GridParams,
    isInner: boolean = true,
  ): Promise<IndexatedFigure> {
    if (!IndexatedFigure.worker) {
      const worker = new Worker();

      IndexatedFigure.worker = new WorkerService(worker);
    }

    const {points: fullPoints} = await Figure.fromShape(shape, params, isInner);

    const {
      data: {points: simplifiedPoints}
    } = await IndexatedFigure.worker.post({
      type: 'indexate',
      payload: {
        points: fullPoints.map((point) => point.toPlain()),
        shape: shape.toPlain(),
        params: params.toPlain(),
      }
    });

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
    if (!IndexatedFigure.worker) return [];

    const {
      data: {points}
    } = await IndexatedFigure.worker.post({
      type: 'tile-intersects',
      payload: {
        tile: tilePoint.toPlain()
      }
    })

    return (points as grider.Point[]).map(({x, y}) => new Point(x, y));
  }
}

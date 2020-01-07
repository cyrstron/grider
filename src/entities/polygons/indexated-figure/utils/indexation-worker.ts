import {WorkerService} from '../../../../services/worker-service';
import Worker from '../workers/border-indexation.worker';
import {GridParams} from '../../../grid-params';
import {GeoPolygon} from '../../geo-polygon';
import {GeoPoint, TileMercPoint, Point} from '../../../points';

export class IndexationWorker {
  worker: WorkerService;

  constructor() {
    this.worker = new WorkerService(new Worker());
  }

  terminate(): void {
    this.worker.close();
  }

  async indexatePoints(
    points: GeoPoint[],
    shape: GeoPolygon,
    params: GridParams,
  ): Promise<GeoPoint[]> {
    const {data} = await this.worker.post<{
      points: grider.GeoPoint[];
      shape: grider.GeoPoint[];
      params: grider.GridParams;
    }>({
      type: 'indexate',
      payload: {
        points: points.map((point) => point.toPlain()),
        shape: shape.toPlain(),
        params: params.toPlain(),
      },
    }) as grider.WorkerAnswer<{points: grider.GeoPoint[]}>;

    return data.points.map((point) => GeoPoint.fromPlain(point));
  }

  async buildTile(tilePoint: TileMercPoint): Promise<Point[]> {
    const {data} = await this.worker.post<{tile: grider.TilePoint}>({
      type: 'tile-intersects',
      payload: {
        tile: tilePoint.toPlain(),
      },
    }) as grider.WorkerAnswer<{points: grider.Point[]}>;

    return data.points.map((point) => Point.fromPlain(point));
  }
}

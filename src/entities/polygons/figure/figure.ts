import { GridParams } from '../../grid-params';
import { GeoPoint } from '../../points/geo-point';
import {GeoPolygon} from '../geo-polygon/geo-polygon';

import { WorkerService } from '../../../services/worker-service';
import Worker from './workers/build-poly.worker';

export class Figure extends GeoPolygon {

  static worker?: WorkerService<{
    shape: grider.GeoPoint[],
    params: grider.GridParams,
    isInner?: boolean,
  }>;

  static async fromShape(
    shape: GeoPolygon,
    params: GridParams,
    isInner: boolean = true,
  ): Promise<Figure> {
    if (!Figure.worker) {
      const worker = new Worker();

      Figure.worker = new WorkerService(worker);
    }

    const payload = {
      shape: shape.toPlain(),
      params: params.toPlain(),
      isInner,
    };

    const {data: points} = await Figure.worker.post(payload) as {data: grider.GeoPoint[]};

    return new Figure(
      points.map(({lat, lng}) => new GeoPoint(lat, lng)),
      shape,
      params,
      isInner,
    );
  }
  constructor(
    points: GeoPoint[],
    public shape: GeoPolygon,
    public params: GridParams,
    public isInner: boolean,
  ) {
    super(points);
  }
}

import {GeoPolygon} from '../geo-polygon/geo-polygon';
import { GridParams } from '../../grid-params';
import { GeoPoint } from '../../points/geo-point';

import Worker from './workers/build-poly.worker';
import { WorkerService } from '../../../services/worker-service';

export class Figure extends GeoPolygon {
  constructor(
    points: GeoPoint[],
    public shape: GeoPolygon,
    public params: GridParams,
    public isInner: boolean,
  ) {
    super(points);
  }

  static async fromShape(
    shape: GeoPolygon, 
    params: GridParams, 
    isInner: boolean = true
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

  static worker?: WorkerService<{
    shape: grider.GeoPoint[],
    params: grider.GridParams,
    isInner?: boolean,
  }>;
}
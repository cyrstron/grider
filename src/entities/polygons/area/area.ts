import { CenterPoint } from '../../points/center-point';
import { GeoPoint } from '../../points/geo-point';
import { GeoPolygon } from '../geo-polygon';
import {WorkerService} from '../../../services/worker-service';

import Worker from './workers/build-area.worker';

export class Area extends GeoPolygon {
  static worker?: WorkerService;

  static async fromCellCenters(centers: CenterPoint[]): Promise<Area> {
    if (centers.length < 1) return new Area([], [], centers);

    if (!Area.worker) {
      const worker = new Worker();
      const params = centers[0].params;
      Area.worker = new WorkerService(worker);

      await Area.worker.post({
        type: 'params',
        payload: {params: params.toPlain()}
      });
    }

    const {data} = await Area.worker.post({
      type: 'join-centers',
      payload: {centers: centers.map((center) => center.toPlain())}
    });

    const polysLiterals = data.polygons as grider.GeoPoint[][];
    const polygons = polysLiterals.map(
      (poly) => poly.map((point) => GeoPoint.fromPlain(point))
    );

    return new Area(polygons[0], polygons, centers);
  }

  constructor(
    points: GeoPoint[],
    public polys: GeoPoint[][],
    public centers: CenterPoint[],
  ) {
    super(points);
  }
}

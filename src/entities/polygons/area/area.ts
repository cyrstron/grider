import { CenterPoint } from '../../points/center-point';
import { GeoPoint } from '../../points/geo-point';
import { GeoPolygon } from '../geo-polygon';
import {AreaWorker} from './utils/area-worker';

export class Area extends GeoPolygon {
  static worker?: AreaWorker;

  static async fromCellCenters(centers: CenterPoint[]): Promise<Area> {
    if (centers.length < 1) return new Area([], [], centers);

    if (!Area.worker) {
      Area.worker = new AreaWorker();
    }

    const params = centers[0].params;

    await Area.worker.postParams(params);

    const centersSet = await Area.worker.getBiggestSet(centers);
    const polys = await Area.worker.joinCenters(centers);

    return new Area(polys[0], polys, centersSet);
  }

  static async biggestSet(centers: CenterPoint[]): Promise<CenterPoint[]> {
    if (centers.length < 1) return [];

    if (!Area.worker) {
      Area.worker = new AreaWorker();
    }

    return await Area.worker.getBiggestSet(centers);
  }

  constructor(
    points: GeoPoint[],
    public polys: GeoPoint[][],
    public centers: CenterPoint[],
  ) {
    super(points);
  }
}

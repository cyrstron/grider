import { WorkerService } from "../../../../services/worker-service";
import Worker from '../workers/build-area.worker';
import { GridParams } from "../../../grid-params";
import { GeoPoint, CenterPoint } from "../../../points";
import {pickBiggestSet, buildArea} from '../workers/utils/build-area';

export class AreaWorker {
  worker?: WorkerService;
  params?: GridParams;

  constructor() {
    if (typeof window !== 'undefined') {
      this.worker = new WorkerService(new Worker());
    }
  }

  terminate() {
    if (!this.worker) return;

    this.worker.terminate();
  }

  async postParams(params: GridParams): Promise<void> {
    if (!this.worker) return;

    await this.worker.post({
      type: 'params',
      payload: {
        params: params.toPlain()
      }
    });
  }

  async getBiggestSet(centers: CenterPoint[]): Promise<CenterPoint[]> {
    if (centers.length === 0) return [];

    const params = centers[0].params;
    
    if (!this.worker) {
      return pickBiggestSet(centers);
    }

    const {data} = await this.worker.post({
      type: 'biggest-set',
      payload: {
        centers: centers.map((center) => center.toPlain()),
        params: params.toPlain(),
      }
    }) as grider.WorkerAnswer<{centers: grider.GridPoint[]}>;

    return data.centers.map((point) => CenterPoint.fromPlain(point, params));
  }

  async joinCenters(centers: CenterPoint[]): Promise<GeoPoint[][]> {
    if (!this.worker) {
      return buildArea(centers);
    }

    const {data} = await this.worker.post({
      type: 'join-centers',
      payload: {
        centers: centers.map((center) => center.toPlain()),
      }
    }) as grider.WorkerAnswer<{polygons: grider.GeoPoint[][]}>;

    return data.polygons.map((poly) => poly.map((point) => GeoPoint.fromPlain(point)));
  }
}
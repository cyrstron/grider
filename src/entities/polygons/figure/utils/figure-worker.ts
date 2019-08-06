import { WorkerService } from "../../../../services/worker-service";
import Worker from '../workers/build-poly.worker';
import { GridParams } from "../../../grid-params";
import { GeoPolygon } from "../../geo-polygon";
import { GeoPoint } from "../../../points";

export class FigureWorker {
  worker: WorkerService;

  constructor() {
    this.worker = new WorkerService(new Worker());
  }

  terminate() {
    this.worker.terminate();
  }

  async postParams(params: GridParams): Promise<void> {
    await this.worker.post({
      type: 'params',
      payload: {
        params: params.toPlain()
      }
    });
  }

  async buildPoly(shape: GeoPolygon, isInner: boolean): Promise<GeoPoint[]> {
    const {data} = await this.worker.post({
      type: 'build-poly',
      payload: {
        shape: shape.toPlain(),
        isInner
      }
    }) as grider.WorkerAnswer<{points: grider.GeoPoint[]}>;

    return data.points.map((point) => GeoPoint.fromPlain(point));
  }
}
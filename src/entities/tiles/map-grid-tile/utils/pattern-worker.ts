import { WorkerService } from "../../../../services/worker-service";
import Worker from '../workers/create-pattern.worker';
import { GridParams } from "../../../grid-params";
import {TileMercPoint } from "../../../points";
import { MapGridTile } from "../map-grid-tile";

export class PatternWorker {
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

  async buildTile(
    tilePoint: TileMercPoint
  ): Promise<grider.MapGridTile> {
    const {data} = await this.worker.post({
      type: 'grid-tile',
      payload: {
        tilePoint: tilePoint.toPlain()
      }
    }) as grider.WorkerAnswer<{mapTile: grider.MapGridTile}>;

    return data.mapTile;
  }
}
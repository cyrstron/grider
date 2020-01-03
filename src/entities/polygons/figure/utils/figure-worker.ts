import { WorkerService } from "../../../../services/worker-service";
import Worker from '../workers/build-poly.worker';
import { GridParams } from "../../../grid-params";
import { GeoPolygon } from "../../geo-polygon";
import { GeoPoint, CenterPoint } from "../../../points";
import { Cell } from "../../cell";

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

  async validateShape(shape: GeoPolygon, params: GridParams): Promise<{
    points: GeoPoint[],
    cells: Cell[],
  }> {
    const {data: {centers, points}} = await this.worker.post({
      type: 'validate',
      payload: {
        shape: shape.toPlain(),
        params: params.toPlain(),
      }
    }) as grider.WorkerAnswer<{
      points: grider.GeoPoint[],
      centers: grider.GridPoint[],
    }>;

    return {
      points: points.map((point) => GeoPoint.fromPlain(point)),
      cells: centers.map((center) => Cell.fromCenter(CenterPoint.fromPlain(center, params))),
    };
  }
}
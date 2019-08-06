import { GridParams } from '../../grid-params';
import { GeoPoint } from '../../points/geo-point';
import {GeoPolygon} from '../geo-polygon/geo-polygon';

import {FigureWorker} from './utils/figure-worker';

export class Figure extends GeoPolygon {

  static worker?: FigureWorker;

  static resetWorker() {
    if (!Figure.worker) return;

    Figure.worker.terminate();

    Figure.worker = undefined;
  }

  static async setGridParams(params: GridParams): Promise<void> {
    if (!Figure.worker) {
      Figure.worker = new FigureWorker();
    }

    await Figure.worker.postParams(params);
  }

  static async fromShape(
    shape: GeoPolygon,
    params: GridParams,
    isInner: boolean = true,
  ): Promise<Figure> {
    if (!Figure.worker) {
      Figure.worker = new FigureWorker();
    }

    await Figure.worker.postParams(params);

    const points = await Figure.worker.buildPoly(shape, isInner);

    return new Figure(
      points,
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

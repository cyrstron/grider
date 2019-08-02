import {CtxService} from '../../../../services/ctx-service';
import { GridParams } from '../../../grid-params';
import {GeoPoint} from '../../../points/geo-point';
import { GeoPolygon } from '../../geo-polygon';
import {buildFigurePoints} from '../utils/calc-figure-points';

const ctx: Worker = self as any;

const worker = new CtxService(ctx);

worker.onMessage((event: MessageEvent) => {
  const {
    shape,
    params,
    isInner,
  } = event.data as {
    shape: grider.GeoPoint[],
    params: grider.GridParams,
    isInner: boolean,
  };

  const points = buildFigurePoints(
    new GeoPolygon(shape.map(({lat, lng}) => new GeoPoint(lat, lng))),
    new GridParams(params),
    isInner,
  );

  worker.post(points.map((point) => point.toPlain()));
});

export default {} as typeof Worker & (new () => Worker);

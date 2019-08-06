import {GridParams} from '../../../grid-params';
import {buildArea, pickBiggestSet} from './utils/build-area';
import { CtxService } from '../../../../services/ctx-service';
import { CenterPoint } from '../../../points';

const ctx: Worker = self as any;
const worker = new CtxService(ctx);

let gridParams: GridParams;

interface ParamsMessage {
  type: 'params';
  payload: {
    params: grider.GridParams;
  }
}

interface GridTileMessage {
  type: 'join-centers',
  payload: {
    centers: grider.GridPoint[],
    params: grider.GridParams,
  }
};

worker.onMessage((e: MessageEvent) => {
  const {data} = e;

  if (data.type === 'params') {
    const {
      payload: {params}
    } = data as ParamsMessage;

    gridParams = GridParams.fromPlain(params);

    worker.post('');

    return;
  }

  if (data.type === 'biggest-set') {
    const {
      payload: {
        centers: centerLiterals,
        params: paramsLiteral,
      }
    } = data as GridTileMessage;

    const params = GridParams.fromPlain(paramsLiteral);

    const centers = centerLiterals.map(
      (center) => CenterPoint.fromPlain(center, params)
    );
    
    const polygons = pickBiggestSet(centers);

    worker.post({
      centers: polygons.map((center) => center.toPlain())
    });

    return;
  }

  if (data.type === 'join-centers') {
    if (!gridParams) throw new Error('Grid params wasn\'t provided.');

    const {
      payload: {
        centers: centerLiterals
      }
    } = data as GridTileMessage;

    const centers = centerLiterals.map(
      (center) => CenterPoint.fromPlain(center, gridParams)
    );
    const polygons = buildArea(centers);

    worker.post({
      polygons: polygons.map((poly) => poly.map((point) => point.toPlain()))
    });
  }
});

export default {} as typeof Worker & (new () => Worker);

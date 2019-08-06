import {GridParams} from '../../../grid-params';
import {createPatterns} from './utils/create-patterns';
import { CtxService } from '../../../../services/ctx-service';
import { TileMercPoint } from '../../../points';
import { GridPattern } from '../../grid-pattern';

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
  type: 'grid-tile',
  payload: {
    tilePoint: grider.TilePoint
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

  if (data.type === 'grid-tile') {
    if (!gridParams) throw new Error('Grid params wasn\'t provided.');

    const {
      payload: {
        tilePoint
      }
    } = data as GridTileMessage;

    let patterns: GridPattern[];

    patterns = createPatterns(
      TileMercPoint.fromPlain(tilePoint), 
      gridParams
    );
  
    worker.post({
      mapTile :{
        patterns: patterns.map((pattern) => pattern.toPlain()),
        tilePoint,
      }
    });
  }
});

export default {} as typeof Worker & (new () => Worker);

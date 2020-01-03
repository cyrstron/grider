import {CtxService} from '../../../../services/ctx-service';
import { GridParams } from '../../../grid-params';
import { GeoPolygon } from '../../geo-polygon';
import {buildFigurePoints} from './utils/calc-figure-points';
import { getInvalidCells } from './utils/cells-invalid-for-figure';

const ctx: Worker = self as any;

const worker = new CtxService(ctx);
let gridParams: GridParams | undefined;

worker.onMessage((event: MessageEvent) => {
  const {
    type
  } = event.data as {
    type: string
  };

  if (type === 'params') {
    const {params} = event.data.payload as {params: grider.GridParams};

    gridParams = GridParams.fromPlain(params);
    
    worker.post('');

    return;
  }

  if (type === 'build-poly') {
    if (!gridParams) throw new Error('Grid Params wasn\'t defined');
    
    const {shape, isInner} = event.data.payload as {
      shape: grider.GeoPoint[];
      isInner: boolean;
    };

    const points = buildFigurePoints(
      GeoPolygon.fromPlain(shape),
      gridParams,
      isInner,
    );
  
    worker.post({points: points.map((point) => point.toPlain())});
  }

  if (type === 'validate') {    
    const {shape, params} = event.data.payload as {
      shape: grider.GeoPoint[];
      params: grider.GridParams;
    };

    const poly = GeoPolygon.fromPlain(shape)
    
    const selfIntersects = poly.selfIntersections;
    const invalidCells = getInvalidCells(poly, GridParams.fromPlain(params));
  
    worker.post({
      centers: invalidCells.map(({center}) => center.toPlain()),
      points: selfIntersects.map((point) => point.toPlain()),
    });
  }
});

export default {} as typeof Worker & (new () => Worker);

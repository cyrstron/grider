import {CtxService} from '../../../../services/ctx-service';
import {Indexation} from './entities/indexation'
import { GeoPoint, TileMercPoint } from '../../../points';
import { simplifyFigure } from './utils/simplify-figure';
import { GeoPolygon } from '../../geo-polygon';
import { GridParams } from '../../../grid-params';

const ctx: Worker = self as any;
const worker = new CtxService(ctx);

let indexation: Indexation;

interface IndexateMessage {
  type: 'indexate';
  payload: {
    points: grider.GeoPoint[];
    params: grider.GridParams;
    shape: grider.GeoPoint[];
  }
}

interface TileIntersectsMessage {
  type: 'tile-intersects',
  payload: {
    tile: {
      tileX: number,
      tileY: number,
      zoom: number,
      tileHeight: number,
      tileWidth: number,
    }
  }
};

worker.onMessage((e: MessageEvent) => {
  const {data} = e;

  if (data.type === 'indexate') {
    const {
      payload: {points, shape, params}
    } = data as IndexateMessage;

    const shapePoly = new GeoPolygon(shape.map(({lat, lng}) => new GeoPoint(lat, lng)));
    const gridParams = new GridParams(params);
    const geoPoints = points.map(({lat, lng}) => new GeoPoint(lat, lng));

    const simplifiedPoints = simplifyFigure(geoPoints, shapePoly, gridParams);

    indexation = Indexation.fromPoints(simplifiedPoints);

    worker.post({points: simplifiedPoints.map((point) => point.toPlain())});

    return;
  }

  if (data.type === 'tile-intersects') {
    if (!indexation) throw new Error('Border points wasn\'t provided.');

    const {
      payload: {
        tile: {tileX, tileY, zoom, tileHeight, tileWidth}
      }
    } = data as TileIntersectsMessage;

    const tilePoint = TileMercPoint.fromTile(tileX, tileY, tileWidth, tileHeight, zoom);
    const tileBorderPoints = indexation.tileBorderPoints(tilePoint);

    worker.post({points: tileBorderPoints.map((point) => point.toPlain())});
  }
});

export default {} as typeof Worker & (new () => Worker);

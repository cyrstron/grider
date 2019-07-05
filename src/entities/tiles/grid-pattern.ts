import {TileMercPoint} from '../points/tile-merc-point';
import { GridParams } from '../grid-params';
import { GridTile } from './grid-tile/grid-tile';

export class GridPattern {
  constructor(
    public tilePoint: TileMercPoint,
    public tile: GridTile,
    public start: TileMercPoint,
    public end: TileMercPoint,
    public params: GridParams,
  ) {}
  
  static fromTileCoords(
    tilePoint: TileMercPoint,
    start: TileMercPoint,
    params: GridParams,
  ): GridPattern {
    const tile = GridTile.fromTileCoords(tilePoint, start, params);
    let endX: number;
    let endY: number;

    if (params.correction === 'merc') {
      endX = tilePoint.x + 1;
      endY = tilePoint.y + 1;
    } else {
      endX = tilePoint.x + 1;
      endY = tilePoint.y + tile.tileHeight;
    }

    const end = TileMercPoint.fromTile(
      endX, 
      endY, 
      tilePoint.tileWidth, 
      tilePoint.tileHeight, 
      tilePoint.zoom
    );

    return new GridPattern(
      tilePoint,
      tile,
      start,
      end,
      params
    );
  }
}
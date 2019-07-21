import {TileMercPoint} from '../points/tile-merc-point';
import { GridParams } from '../grid-params';
import { GridTile } from './grid-tile/grid-tile';
import { Point } from '../points';

export class GridPattern {
  constructor(
    public tilePoint: TileMercPoint,
    public tile: GridTile,
    public start: Point,
    public end: Point,
    public params: GridParams,
  ) {}
  
  static fromTileCoords(
    tilePoint: TileMercPoint,
    start: Point,
    params: GridParams,
  ): GridPattern {
    const tile = GridTile.fromTileCoords(tilePoint, start, params);
    let endX: number;
    let endY: number;

    if (params.correction === 'merc') {
      endX = 1;
      endY = 1;
    } else {
      endX = 1;
      endY = start.y + tile.tileHeight;
    }

    const end = new Point(endX, endY);

    return new GridPattern(
      tilePoint,
      tile,
      start,
      end,
      params
    );
  }
}
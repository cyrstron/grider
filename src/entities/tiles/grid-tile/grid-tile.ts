import { GridParams } from "../../grid-params";

import {expandTile} from './utils/expand';
import { TileMercPoint } from "../../points/tile-merc-point";

export class GridTile {
  constructor(
    public points: TileMercPoint[][], 
    public tilePoint: TileMercPoint,
    public tileWidth: number,
    public tileHeight: number,
    public params: GridParams,
  ) {}

  static fromTileCoords(
    tilePoint: TileMercPoint,
    start: TileMercPoint,
    params: GridParams,
  ) {
    const startGridCenter = start.toSphere()
      .toCenter(params);

    const {
      southEast: patternGridCenter,
    } = startGridCenter.southEastNeighbors;
    const {
      southEast: patternGridEnd,
    } = patternGridCenter.southEastNeighbors;

    const patternMercEnd = patternGridEnd.toGeo()
      .toMerc();

    const end = TileMercPoint.fromMerc(
      patternMercEnd,
      start.tileWidth,
      start.tileHeight,
      start.zoom,
    );

    const patternGeoCenter = patternGridCenter.toGeo();

    const tileWidth = end.x - start.x;
    const tileHeight = end.y - start.y;
    
    const points = expandTile(patternGeoCenter, tilePoint, params);

    return new GridTile(
      points,
      tilePoint,
      tileWidth,
      tileHeight,
      params
    );
  }
}
import { GridParams } from "../../grid-params";

import {expandTile} from './utils/expand';
import { TileMercPoint } from "../../points/tile-merc-point";
import { Point } from "../../points";

export class GridTile {
  constructor(
    public points: Point[][], 
    public tilePoint: TileMercPoint,
    public tileWidth: number,
    public tileHeight: number,
    public params: GridParams,
  ) {}

  static fromTileCoords(
    tilePoint: TileMercPoint,
    start: Point,
    params: GridParams,
  ) {
    const startTilePoint = TileMercPoint.fromTile(
      tilePoint.tileX + start.x,
      tilePoint.tileY + start.y,
      tilePoint.tileWidth,
      tilePoint.tileHeight,
      tilePoint.zoom,
    );

    const startGridCenter = startTilePoint.toSphere()
      .toCenter(params);

    const {
      southEast: patternGridCenter,
    } = startGridCenter.southEastNeighbors;
    const {
      southEast: patternGridEnd,
    } = patternGridCenter.southEastNeighbors;

    const patternMercEnd = patternGridEnd.toGeo()
      .toMerc();

    const endTilePoint = TileMercPoint.fromMerc(
      patternMercEnd,
      startTilePoint.tileWidth,
      startTilePoint.tileHeight,
      startTilePoint.zoom,
    );

    const patternGeoCenter = patternGridCenter.toGeo();

    const tileWidth = endTilePoint.tileX - startTilePoint.tileX;
    const tileHeight = endTilePoint.tileY - startTilePoint.tileY;
    
    const points = expandTile(patternGeoCenter, startTilePoint, tileWidth, tileHeight, params);

    return new GridTile(
      points,
      tilePoint,
      tileWidth,
      tileHeight,
      params
    );
  }
}
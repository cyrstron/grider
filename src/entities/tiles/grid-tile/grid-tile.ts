import { GridParams } from "../../grid-params";

import {expandTile} from './utils/expand';
import { TileMercPoint } from "../../points/tile-merc-point";
import { Point } from "../../points/point";

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
    const {
      tileX,
      tileY,
      tileHeight,
      tileWidth,
      zoom
    } = tilePoint;

    const startTilePoint = TileMercPoint.fromTile(
      tileX + start.x,
      tileY + start.y,
      tileWidth,
      tileHeight,
      zoom,
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

    let {tileX: startTileX, tileY: startTileY} = startTilePoint;
    const {tileX: endTileX, tileY: endTileY} = TileMercPoint.fromMerc(
      patternMercEnd,
      tileWidth,
      tileHeight,
      zoom,
    );

    if (endTileX < startTileX) {
      startTileX = startTileX - Math.ceil(startTileX);
    }

    const patternGeoCenter = patternGridCenter.toGeo();
    const width = endTileX - startTileX;
    const height = endTileY - startTileY;
    
    const points = expandTile(patternGeoCenter, startTilePoint, width, height, params);

    return new GridTile(
      points,
      tilePoint,
      width,
      height,
      params
    );
  }
}
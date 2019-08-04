import { GridParams } from '../../grid-params';

import { CenterPoint } from '../../points/center-point';
import { GeoPoint } from '../../points/geo-point';
import { Point } from '../../points/point';
import { TileMercPoint } from '../../points/tile-merc-point';
import {expandTile} from './utils/expand';

export class GridTile {

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
      zoom,
    } = tilePoint;

    const startTilePoint = TileMercPoint.fromTile(
      tileX + start.x,
      tileY + start.y,
      tileWidth,
      tileHeight,
      zoom,
    );

    const startGeo = GeoPoint.fromMerc(startTilePoint);

    const startGridCenter = CenterPoint.fromGeo(startGeo, params);

    const {
      southEast: patternGridCenter,
    } = startGridCenter.southEastNeighbors;
    const {
      southEast: patternGridEnd,
    } = patternGridCenter.southEastNeighbors;

    const patternMercEnd = patternGridEnd.toGeo()
      .toMerc();

    const {tileY: startTileY} = startTilePoint;
    let {tileX: startTileX} = startTilePoint;

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
      params,
    );
  }

  static fromPlain(
    {points, tileHeight, tileWidth}: {
      points: grider.Point[][],
      tileHeight: number,
      tileWidth: number,
    },
    tilePoint: TileMercPoint,
    params: GridParams, 
  ) {
    return new GridTile(
      points.map((line) => line.map(({x, y}) => new Point(x, y))),
      tilePoint,
      tileWidth,
      tileHeight,
      params
    )
  }

  constructor(
    public points: Point[][],
    public tilePoint: TileMercPoint,
    public tileWidth: number,
    public tileHeight: number,
    public params: GridParams,
  ) {}

  toPlain(): grider.GridTile {
    return {
      points: this.points.map((line) => line.map(({x, y}) => ({x, y}))),
      tileHeight: this.tileHeight,
      tileWidth: this.tileWidth,
    }
  }
}

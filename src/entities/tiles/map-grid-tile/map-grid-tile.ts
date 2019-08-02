import { GridParams } from '../../grid-params';
import {TileMercPoint} from '../../points/tile-merc-point';
import { GridPattern } from '../grid-pattern';

import { GeoPoint } from '../../points/geo-point';
import {createPatterns} from './utils/create-patterns';

export class MapGridTile {

  get northWest(): GeoPoint {
    return GeoPoint.fromMerc(this.tilePoint);
  }

  get southWest(): GeoPoint {
    return GeoPoint.fromMerc(this.tilePoint.southTile);
  }

  get northEast(): GeoPoint {
    return GeoPoint.fromMerc(this.tilePoint.eastTile);
  }

  get southEast(): GeoPoint {
    return GeoPoint.fromMerc(this.tilePoint.southTile.eastTile);
  }

  get north(): number {
    return this.northWest.lat;
  }

  get west(): number {
    return this.northWest.lng;
  }

  get south(): number {
    return this.southWest.lat;
  }

  get east(): number {
    return this.northEast.lng;
  }

  static fromTileCoords(
    {x, y}: grider.Point,
    params: GridParams,
    zoom: number,
    tileWidth: number,
    tileHeight: number,
  ): MapGridTile {
    const tilePoint = TileMercPoint.fromTile(x, y, tileWidth, tileHeight, zoom);

    return MapGridTile.fromTilePoint(tilePoint, params);
  }

  static fromTilePoint(
    tilePoint: TileMercPoint,
    params: GridParams,
  ): MapGridTile {
    const patterns = createPatterns(tilePoint, params);

    return new MapGridTile(tilePoint, patterns, params);
  }
  constructor(
    public tilePoint: TileMercPoint,
    public patterns: GridPattern[],
    public params: GridParams,
  ) {}
}

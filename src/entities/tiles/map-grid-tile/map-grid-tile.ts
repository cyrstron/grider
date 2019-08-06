import { GridParams } from '../../grid-params';
import {TileMercPoint} from '../../points/tile-merc-point';
import { GridPattern } from '../grid-pattern';
import { GeoPoint } from '../../points/geo-point';

import {PatternWorker} from './utils/pattern-worker';

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
  ): Promise<MapGridTile> {
    const tilePoint = TileMercPoint.fromTile(x, y, tileWidth, tileHeight, zoom);

    return MapGridTile.fromTilePoint(tilePoint, params);
  }

  static async fromTilePoint(
    tilePoint: TileMercPoint,
    params: GridParams,
  ): Promise<MapGridTile> {
    if (!MapGridTile.worker) {
      MapGridTile.worker = new PatternWorker();
    }

    await MapGridTile.worker.postParams(params);

    const tile = await MapGridTile.worker.buildTile(tilePoint);

    return MapGridTile.fromPlain(tile, params);
  }

  toPlain(): grider.MapGridTile {
    return {
      patterns: this.patterns.map((pattern) => pattern.toPlain()),
      tilePoint: this.tilePoint.toPlain(),
    };
  }

  static worker?: PatternWorker;

  static fromPlain(
    {tilePoint: tileLiteral, patterns}: grider.MapGridTile,
    params: GridParams,
  ): MapGridTile {
    const tilePoint = TileMercPoint.fromPlain(tileLiteral);

    return new MapGridTile(
      tilePoint,
      patterns.map((pattern) => GridPattern.fromPlain(pattern, tilePoint, params)),
      params,
    );
  }
  
  constructor(
    public tilePoint: TileMercPoint,
    public patterns: GridPattern[],
    public params: GridParams,
  ) {}
}

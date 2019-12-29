import {constants} from '../../constants';
import { GridParams } from '../grid-params';
import { GeoPolygon } from '../polygons/geo-polygon';
import { GeoSegment } from '../segments/geo-segment';
import { CenterPoint } from './center-point';
import { GeoPoint } from './geo-point';
import { MercPoint } from './merc-point';
import { Point } from './point';

type Bounds = {[key in grider.Cardinal]: GeoSegment};

export class TileMercPoint extends MercPoint implements Bounds {

  get zoomCoofX(): number {
    return 2 ** this.zoom * constants.googleTileSize / this.tileWidth;
  }

  get zoomCoofY(): number {
    return 2 ** this.zoom * constants.googleTileSize / this.tileHeight;
  }

  get northTile(): TileMercPoint {
    const {
        tileX,
        tileY,
        tileHeight,
        tileWidth,
        zoom,
    } = this;

    return TileMercPoint.fromTile(
      tileX,
      tileY - 1,
      tileWidth,
      tileHeight,
      zoom,
    );
  }

  get southTile(): TileMercPoint {
    const {
        tileX,
        tileY,
        tileHeight,
        tileWidth,
        zoom,
    } = this;

    return TileMercPoint.fromTile(
      tileX,
      tileY + 1,
      tileWidth,
      tileHeight,
      zoom,
    );
  }

  get eastTile(): TileMercPoint {
    const {
        tileX,
        tileY,
        tileHeight,
        tileWidth,
        zoom,
    } = this;

    return TileMercPoint.fromTile(
      tileX + 1,
      tileY,
      tileWidth,
      tileHeight,
      zoom,
    );
  }

  get westTile(): TileMercPoint {
    const {
        tileX,
        tileY,
        tileHeight,
        tileWidth,
        zoom,
    } = this;

    return TileMercPoint.fromTile(
      tileX - 1,
      tileY,
      tileWidth,
      tileHeight,
      zoom,
    );
  }

  get northBound(): number {
    return GeoPoint.fromMerc(this).lat;
  }

  get southBound(): number {
    return GeoPoint.fromMerc(this.southTile).lat;
  }

  get eastBound(): number {
    return GeoPoint.fromMerc(this.eastTile).lng;
  }

  get westBound(): number {
    return GeoPoint.fromMerc(this).lng;
  }

  get north(): GeoSegment {
    return new GeoSegment(
      GeoPoint.fromMerc(this),
      GeoPoint.fromMerc(this.eastTile),
    );
  }

  get south(): GeoSegment {
    const southPoint = this.southTile;

    return new GeoSegment(
      GeoPoint.fromMerc(southPoint.eastTile),
      GeoPoint.fromMerc(southPoint),
    );
  }

  get east(): GeoSegment {
    const eastPoint = this.eastTile;

    return new GeoSegment(
      GeoPoint.fromMerc(eastPoint),
      GeoPoint.fromMerc(eastPoint.southTile),
    );
  }

  get west(): GeoSegment {
    return new GeoSegment(
      GeoPoint.fromMerc(this.southTile),
      GeoPoint.fromMerc(this),
    );
  }

  static fromTile(
    tileX: number,
    tileY: number,
    tileWidth: number,
    tileHeight: number,
    zoom: number,
  ): TileMercPoint {
    const x = tileX / (2 ** (zoom) * (constants.googleTileSize / tileWidth));
    const y = tileY / (2 ** (zoom) * (constants.googleTileSize / tileHeight));

    return new TileMercPoint(
      x,
      y,
      tileX,
      tileY,
      tileWidth,
      tileHeight,
      zoom,
    );
  }

  static fromPlain({
      x,
      y,
      tileX,
      tileY,
      tileWidth,
      tileHeight,
      zoom
    }: grider.TilePoint
  ): TileMercPoint {
    return new TileMercPoint(x, y, tileX, tileY, tileWidth, tileHeight, zoom);
  }

  static fromMerc(
    mercPoint: MercPoint,
    tileWidth: number,
    tileHeight: number,
    zoom: number,
  ): TileMercPoint {
    const tileX = mercPoint.x * (2 ** (zoom) * (constants.googleTileSize / tileWidth));
    const tileY = mercPoint.y * (2 ** (zoom) * (constants.googleTileSize / tileHeight));

    return new TileMercPoint(
      mercPoint.x,
      mercPoint.y,
      tileX,
      tileY,
      tileWidth,
      tileHeight,
      zoom,
    );
  }
  tileX: number;
  tileY: number;
  tileWidth: number;
  tileHeight: number;
  zoom: number;

  constructor(
    x: number,
    y: number,
    tileX: number,
    tileY: number,
    tileWidth: number,
    tileHeight: number,
    zoom: number,
  ) {
    super(x, y);

    this.tileX = tileX;
    this.tileY = tileY;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.zoom = zoom;
  }

  gridPatternStartPoint(params: GridParams): Point {
    const geoPoint = GeoPoint.fromMerc(this);
    const gridCenter = CenterPoint.fromGeo(geoPoint, params);
    const {northWest} = gridCenter.northWestNeighbors;
    const gridTileTopLeft = northWest.toGeo().toMerc();

    const startTilePoint = TileMercPoint.fromMerc(
      gridTileTopLeft,
      this.tileWidth,
      this.tileHeight,
      this.zoom,
    );

    return this.startPointDiff(startTilePoint);
  }

  startPointDiff(startTilePoint: TileMercPoint): Point {
    let x = startTilePoint.tileX - this.tileX;
    const y = startTilePoint.tileY - this.tileY;

    if (x > this.tileX) {
      x = x - Math.ceil(x);
    }

    return new Point(x, y);
  }

  toPoly(): GeoPolygon {
    const eastPoint = this.eastTile;

    return new GeoPolygon([
      GeoPoint.fromMerc(this),
      GeoPoint.fromMerc(eastPoint),
      GeoPoint.fromMerc(eastPoint.southTile),
      GeoPoint.fromMerc(this.southTile),
    ]);
  }

  containsPoint({lat, lng}: GeoPoint): boolean {
    return (
      lat <= this.northBound &&
      lat >= this.southBound &&
      lng <= this.eastBound &&
      lng >= this.westBound
    );
  }

  projectGeoPoints(points: GeoPoint[]): Point[] {
    return points.map((geoPoint) => {
      const mercPoint = geoPoint.toMerc();
      const {tileX, tileY} = TileMercPoint.fromMerc(
        mercPoint,
        this.tileWidth,
        this.tileHeight,
        this.zoom,
      );

      const x = Math.round((tileX - this.tileX) * this.tileWidth);
      const y = Math.round((tileY - this.tileY) * this.tileHeight);

      return new Point(x, y);
    });
  }

  toPlain(): {
    x: number,
    y: number,
    tileX: number,
    tileY: number,
    zoom: number,
    tileHeight: number,
    tileWidth: number,
  } {
    return {
      x: this.x,
      y: this.y,
      tileX: this.tileX,
      tileY: this.tileY,
      zoom: this.zoom,
      tileHeight: this.tileHeight,
      tileWidth: this.tileWidth,
    }
  }
}

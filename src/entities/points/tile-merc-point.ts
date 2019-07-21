import { MercPoint } from "./merc-point";
import {constants} from '../../constants';
import { GridParams } from "../grid-params";
import { Point } from "./point";
import { GeoPolygon } from "../polygons";
import { GeoSegment } from "../segments";
import { GeoPoint } from "./geo-point";

type Bounds = {[key in grider.Cardinal]: GeoSegment};

export class TileMercPoint extends MercPoint implements Bounds {
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
    zoom: number
  ) {
    super(x, y);

    this.tileX = tileX;
    this.tileY = tileY;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.zoom = zoom;
  }

  gridPatternStartPoint(params: GridParams): Point {
    const gridCenter = this.toSphere().toCenter(params);
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

  get zoomCoofX(): number {
    return 2 ** this.zoom * constants.googleTileSize / this.tileWidth;
  }

  get zoomCoofY(): number {
    return 2 ** this.zoom * constants.googleTileSize / this.tileHeight;    
  }

  toPoly(): GeoPolygon {
    const eastPoint = this.eastTile;

    return new GeoPolygon([
      this.toSphere(),
      eastPoint.toSphere(),
      eastPoint.southTile.toSphere(),
      this.southTile.toSphere(),
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

  static fromTile(    
    tileX: number, 
    tileY: number, 
    tileWidth: number, 
    tileHeight: number, 
    zoom: number
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
      zoom
    );
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
      zoom
    );
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
    return this.toSphere().lat;
  }

  get southBound(): number {
    return this.southTile.toSphere().lat;
  }

  get eastBound(): number {
    return this.eastTile.toSphere().lng;
  }

  get westBound(): number {
    return this.toSphere().lng;
  }

  get north(): GeoSegment {
    return new GeoSegment(this.toSphere(), this.eastTile.toSphere());
  }

  get south(): GeoSegment {
    const southPoint = this.southTile;

    return new GeoSegment(southPoint.eastTile.toSphere(), southPoint.toSphere());
  }

  get east(): GeoSegment {
    const eastPoint = this.eastTile;

    return new GeoSegment(eastPoint.toSphere(), eastPoint.southTile.toSphere());
  }

  get west(): GeoSegment {
    return new GeoSegment( this.southTile.toSphere(), this.toSphere());
  }
}
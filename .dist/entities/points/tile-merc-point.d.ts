import { GridParams } from '../grid-params';
import { GeoPolygon } from '../polygons/geo-polygon';
import { GeoSegment } from '../segments/geo-segment';
import { GeoPoint } from './geo-point';
import { MercPoint } from './merc-point';
import { Point } from './point';
declare type Bounds = {
    [key in grider.Cardinal]: GeoSegment;
};
export declare class TileMercPoint extends MercPoint implements Bounds {
    tileX: number;
    tileY: number;
    tileWidth: number;
    tileHeight: number;
    zoom: number;
    constructor(x: number, y: number, tileX: number, tileY: number, tileWidth: number, tileHeight: number, zoom: number);
    get zoomCoofX(): number;
    get zoomCoofY(): number;
    get northTile(): TileMercPoint;
    get southTile(): TileMercPoint;
    get eastTile(): TileMercPoint;
    get westTile(): TileMercPoint;
    get northBound(): number;
    get southBound(): number;
    get eastBound(): number;
    get westBound(): number;
    get north(): GeoSegment;
    get south(): GeoSegment;
    get east(): GeoSegment;
    get west(): GeoSegment;
    gridPatternStartPoint(params: GridParams): Point;
    startPointDiff(startTilePoint: TileMercPoint): Point;
    toPoly(): GeoPolygon;
    containsPoint({ lat, lng }: grider.GeoPoint): boolean;
    projectGeoPoints(points: GeoPoint[]): Point[];
    toPlain(): {
        x: number;
        y: number;
        tileX: number;
        tileY: number;
        zoom: number;
        tileHeight: number;
        tileWidth: number;
    };
    static fromTile(tileX: number, tileY: number, tileWidth: number, tileHeight: number, zoom: number): TileMercPoint;
    static fromPlain({ x, y, tileX, tileY, tileWidth, tileHeight, zoom, }: grider.TilePoint): TileMercPoint;
    static fromMerc(mercPoint: MercPoint, tileWidth: number, tileHeight: number, zoom: number): TileMercPoint;
}
export {};

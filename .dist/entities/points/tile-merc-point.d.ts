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
    readonly zoomCoofX: number;
    readonly zoomCoofY: number;
    readonly northTile: TileMercPoint;
    readonly southTile: TileMercPoint;
    readonly eastTile: TileMercPoint;
    readonly westTile: TileMercPoint;
    readonly northBound: number;
    readonly southBound: number;
    readonly eastBound: number;
    readonly westBound: number;
    readonly north: GeoSegment;
    readonly south: GeoSegment;
    readonly east: GeoSegment;
    readonly west: GeoSegment;
    static fromTile(tileX: number, tileY: number, tileWidth: number, tileHeight: number, zoom: number): TileMercPoint;
    static fromPlain({ x, y, tileX, tileY, tileWidth, tileHeight, zoom, }: grider.TilePoint): TileMercPoint;
    static fromMerc(mercPoint: MercPoint, tileWidth: number, tileHeight: number, zoom: number): TileMercPoint;
    tileX: number;
    tileY: number;
    tileWidth: number;
    tileHeight: number;
    zoom: number;
    constructor(x: number, y: number, tileX: number, tileY: number, tileWidth: number, tileHeight: number, zoom: number);
    gridPatternStartPoint(params: GridParams): Point;
    startPointDiff(startTilePoint: TileMercPoint): Point;
    toPoly(): GeoPolygon;
    containsPoint({ lat, lng }: GeoPoint): boolean;
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
}
export {};

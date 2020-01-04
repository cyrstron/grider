import { GeoPoint } from '../points/geo-point';
import { MercLine } from './merc-line';
export declare class RhumbLine extends MercLine {
    static fromTwoGeoPoints(pointA: GeoPoint, pointB: GeoPoint): RhumbLine;
    isAntiMeridian: boolean;
    constructor(a: number, b: number, c: number, isAntiMeridial: boolean);
    lngByLat(lat: number): number | undefined;
    latByLng(lng: number): number | undefined;
}

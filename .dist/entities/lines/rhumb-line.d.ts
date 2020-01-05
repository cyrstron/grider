import { GeoPoint } from '../points/geo-point';
import { MercLine } from './merc-line';
export declare class RhumbLine extends MercLine {
    isAntiMeridian: boolean;
    constructor(a: number, b: number, c: number, isAntiMeridial: boolean);
    static fromTwoGeoPoints(pointA: GeoPoint, pointB: GeoPoint): RhumbLine;
    lngByLat(lat: number): number | undefined;
    latByLng(lng: number): number | undefined;
}

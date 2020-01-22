import { MercPoint } from './merc-point';
export declare class GeoPoint {
    lat: number;
    lng: number;
    constructor(lat: number, lng: number);
    isEqual(point: GeoPoint): boolean;
    isCloserThroughAntiMeridian(point: GeoPoint): boolean;
    toOppositeHemisphere(): GeoPoint;
    calcMercDistance(pointB: GeoPoint): number;
    toMerc(): MercPoint;
    toSemiSphere(): GeoPoint;
    fromSemiSphere(): GeoPoint;
    toFormatted(): GeoPoint;
    isEasternTo(point: GeoPoint): boolean;
    isWesternTo(point: GeoPoint): boolean;
    isNorthernTo(point: GeoPoint): boolean;
    isSouthernTo(point: GeoPoint): boolean;
    toPlain(): grider.GeoPoint;
    toGeoJSON(): grider.GeoJSONPoint;
    static fromPlain({ lat, lng }: grider.GeoPoint): GeoPoint;
    static fromGeoJSON({ coordinates: [lng, lat] }: grider.GeoJSONPoint): GeoPoint;
    static createFormatted(lat: number, lng: number): GeoPoint;
    static fromUnsafeCoords(lat: number, lng: number): GeoPoint;
    static fromMerc(point: MercPoint): GeoPoint;
}

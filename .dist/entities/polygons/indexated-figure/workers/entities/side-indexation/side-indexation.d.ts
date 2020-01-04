import { GeoSegment } from '../../../../../segments/geo-segment';
import { SpreadedSide } from '../indexation';
import { GeoPoint } from '../../../../../points/geo-point';
import { GeoPolygon } from '../../../../geo-polygon';
import { BoundIntersection } from '../bound-intersection';
export declare class SideIndexation {
    points: GeoPoint[];
    spreadedSide: SpreadedSide;
    lngIndexes: {
        [key: string]: number[];
    };
    latIndexes: {
        [key: string]: number[];
    };
    lngKeys: {
        [key: string]: number[];
    };
    latKeys: {
        [key: string]: number[];
    };
    approximation: GeoSegment;
    readonly isAntiMeridian: boolean;
    readonly north: number;
    readonly south: number;
    readonly east: number;
    readonly west: number;
    static fromSpreadedSide(points: GeoPoint[], spreaded: SpreadedSide): SideIndexation;
    constructor(points: GeoPoint[], spreadedSide: SpreadedSide, lngIndexes: {
        [key: string]: number[];
    }, latIndexes: {
        [key: string]: number[];
    }, lngKeys: {
        [key: string]: number[];
    }, latKeys: {
        [key: string]: number[];
    }, approximation: GeoSegment);
    boundIntersection(bound: number, tilePoly: GeoPolygon, boundKey: grider.Cardinal): BoundIntersection | undefined;
    closestLatKeys(lat: number): number[] | undefined;
    closestLngKeys(lng: number): number[] | undefined;
}

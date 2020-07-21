import { GeoPoint } from '../../points/geo-point';
import { GeoSegment } from '../../segments/geo-segment';
import { GenericPolygon } from '../generic-polygon';
export declare class GeoPolygon<SegmentType extends GeoSegment = GeoSegment> extends GenericPolygon<GeoPoint, SegmentType> {
    sideByIndex(index: number): SegmentType;
    sideByIndexInversed(index: number): SegmentType;
    splitSectionsByLng(lng: number): GeoSegment[];
    splitSectionsByLat(lat: number): GeoSegment[];
    intersectsSegment(segment: GeoSegment): boolean;
    intersectsWithSegment(segment: GeoSegment): GeoPoint[];
    closestSideToSegment(segment: GeoSegment): SegmentType;
    pointsByDistanceToSegment(segment: GeoSegment): GeoPoint[];
    pointsInsidePoly(poly: GeoPolygon): GeoPoint[];
    pointsOutsidePoly(poly: GeoPolygon): GeoPoint[];
    arePointsInsidePoly(poly: GeoPolygon): boolean;
    arePointsOutsidePoly(poly: GeoPolygon): boolean;
    containsPoint(point: GeoPoint): boolean;
    isValidForFigure(): boolean;
    get outmapPoints(): GeoPoint[];
    get easternPoint(): GeoPoint;
    get westernPoint(): GeoPoint;
    get northernPoint(): GeoPoint;
    get southernPoint(): GeoPoint;
    toPlain(): grider.GeoPoint[];
    toGeoJSON(): grider.GeoJSONPolygon;
    static fromGeoJSON({ coordinates: [polygon] }: grider.GeoJSONPolygon): GeoPolygon;
    static fromPlain(points: grider.GeoPoint[]): GeoPolygon;
}

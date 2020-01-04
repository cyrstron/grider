import { GeoSegment } from '../../../../segments/geo-segment';
import { BoundIntersection } from './bound-intersection';
export declare class SplitGeoSegment extends GeoSegment {
    boundA: BoundIntersection;
    boundB: BoundIntersection;
    static splitsByLng(bounds: BoundIntersection[], direction: grider.Cardinal): SplitGeoSegment[];
    static splitsByLat(bounds: BoundIntersection[], direction: grider.Cardinal): SplitGeoSegment[];
    constructor(boundA: BoundIntersection, boundB: BoundIntersection);
}

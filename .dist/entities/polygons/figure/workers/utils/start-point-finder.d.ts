import { GridParams } from '../../../../grid-params';
import { GeoPoint } from '../../../../points/geo-point';
import { GeoSegment } from '../../../../segments/geo-segment';
import { Cell } from '../../../cell';
import { GeoPolygon } from '../../../geo-polygon/geo-polygon';
export declare function findStartPointForSide(shapeSide: GeoSegment, shape: GeoPolygon, params: GridParams, isInner: boolean): GeoPoint | undefined;
export declare function recalcStartCell(points: GeoPoint[], shapeSide: GeoSegment, params: GridParams): Cell | undefined;

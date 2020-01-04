import { GridParams } from '../../../../grid-params';
import { GeoPoint } from '../../../../points/geo-point';
import { GeoPolygon } from '../../../geo-polygon/geo-polygon';
export declare function buildFigurePoints(shape: GeoPolygon, params: GridParams, isInner: boolean): GeoPoint[];

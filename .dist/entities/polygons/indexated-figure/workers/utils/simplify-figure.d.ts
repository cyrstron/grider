import { GridParams } from '../../../../grid-params';
import { GeoPoint } from '../../../../points/geo-point';
import { GeoPolygon } from '../../../geo-polygon';
export declare function simplifyFigure(points: GeoPoint[], shape: GeoPolygon, params: GridParams): GeoPoint[];

import { GridParams } from '../../../grid-params';
import { GeoPolygon } from '../../../polygons/geo-polygon';
import { GeoPoint } from '../../geo-point';
export declare function correctForGrid(point: GeoPoint, { correction }: GridParams): GeoPoint;
export declare function correctForGeo(point: GeoPoint, gridParams: GridParams): GeoPoint;
export declare function correctPoly(poly: GeoPolygon, { correction }: GridParams): GeoPolygon;

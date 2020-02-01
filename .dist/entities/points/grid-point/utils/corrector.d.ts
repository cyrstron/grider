import { GridParams } from '../../../grid-params';
import { GeoPoint } from '../../geo-point';
export declare function correctForGrid(point: GeoPoint, { correction }: GridParams): GeoPoint;
export declare function correctForGeo(point: GeoPoint, gridParams: GridParams): GeoPoint;

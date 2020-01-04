import { GridParams } from '../../../grid-params';
import { GeoPoint } from '../../geo-point';
import { GridPoint } from '../grid-point';
export declare function toGrid(point: GeoPoint, axisParams: grider.GridAxis, params: GridParams): number;
export declare function toGeo(point: GridPoint, axisParams: grider.Axis): number;

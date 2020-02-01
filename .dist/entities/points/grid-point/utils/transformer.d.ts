import { GridParams } from '../../../grid-params';
import { GeoPoint } from '../../geo-point';
import { GridPoint } from '../grid-point';
export declare function rotateToGrid(point: GeoPoint, axisParams: grider.GridAxis, isHorizontal: boolean): number;
export declare function rotateToGeo(point: GridPoint, axisParams: grider.Axis): number;
export declare function toGridScale(value: number, gridParams: grider.GridParams): number;
export declare function toGeoScale(value: number, gridParams: grider.GridParams): number;
export declare function toGrid(point: GeoPoint, axisParams: grider.GridAxis, params: GridParams): number;
export declare function toGeo(point: GridPoint, axisParams: grider.Axis): number;

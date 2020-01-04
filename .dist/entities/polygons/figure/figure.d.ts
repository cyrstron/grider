import { GridParams } from '../../grid-params';
import { GeoPoint } from '../../points/geo-point';
import { GeoPolygon } from '../geo-polygon/geo-polygon';
import { FigureWorker } from './utils/figure-worker';
import { Cell } from '../cell';
export declare class Figure extends GeoPolygon {
    shape: GeoPolygon;
    params: GridParams;
    isInner: boolean;
    static worker?: FigureWorker;
    static resetWorker(): void;
    static setGridParams(params: GridParams): Promise<void>;
    static fromShape(shape: GeoPolygon, params: GridParams, isInner?: boolean): Promise<Figure>;
    static validateShape(shape: GeoPolygon, params: GridParams): Promise<{
        cells: Cell[];
        points: GeoPoint[];
    }>;
    constructor(points: GeoPoint[], shape: GeoPolygon, params: GridParams, isInner: boolean);
}

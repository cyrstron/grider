import { CenterPoint } from '../../points/center-point';
import { GeoPoint } from '../../points/geo-point';
import { GeoPolygon } from '../geo-polygon';
import { AreaWorker } from './utils/area-worker';
export declare class Area extends GeoPolygon {
    polys: GeoPoint[][];
    centers: CenterPoint[];
    static worker?: AreaWorker;
    static fromCellCenters(centers: CenterPoint[]): Promise<Area>;
    static biggestSet(centers: CenterPoint[]): Promise<CenterPoint[]>;
    constructor(points: GeoPoint[], polys: GeoPoint[][], centers: CenterPoint[]);
}

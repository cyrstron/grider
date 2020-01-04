import { CenterPoint } from '../../points/center-point';
import { GeoPoint } from '../../points/geo-point';
export declare class CellConnection {
    centerA: CenterPoint;
    centerB: CenterPoint;
    path: GeoPoint[];
    innerCenters: CenterPoint[];
    static fromCenters(centerA: CenterPoint, centerB: CenterPoint): CellConnection;
    constructor(centerA: CenterPoint, centerB: CenterPoint, path: GeoPoint[], innerCenters: CenterPoint[]);
}

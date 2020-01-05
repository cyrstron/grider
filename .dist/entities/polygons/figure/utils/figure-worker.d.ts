import { WorkerService } from '../../../../services/worker-service';
import { GridParams } from '../../../grid-params';
import { GeoPolygon } from '../../geo-polygon';
import { GeoPoint } from '../../../points';
import { Cell } from '../../cell';
export declare class FigureWorker {
    worker: WorkerService;
    constructor();
    terminate(): void;
    postParams(params: GridParams): Promise<void>;
    buildPoly(shape: GeoPolygon, isInner: boolean): Promise<GeoPoint[]>;
    validateShape(shape: GeoPolygon, params: GridParams): Promise<{
        points: GeoPoint[];
        cells: Cell[];
    }>;
}

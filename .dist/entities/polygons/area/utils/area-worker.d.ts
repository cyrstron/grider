import { WorkerService } from "../../../../services/worker-service";
import { GridParams } from "../../../grid-params";
import { GeoPoint, CenterPoint } from "../../../points";
export declare class AreaWorker {
    worker?: WorkerService;
    params?: GridParams;
    constructor();
    terminate(): void;
    postParams(params: GridParams): Promise<void>;
    getBiggestSet(centers: CenterPoint[]): Promise<CenterPoint[]>;
    joinCenters(centers: CenterPoint[]): Promise<GeoPoint[][]>;
}

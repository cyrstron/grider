import { WorkerService } from "../../../../services/worker-service";
import { GridParams } from "../../../grid-params";
import { TileMercPoint } from "../../../points";
export declare class PatternWorker {
    worker: WorkerService;
    constructor();
    terminate(): void;
    postParams(params: GridParams): Promise<void>;
    buildTile(tilePoint: TileMercPoint): Promise<grider.MapGridTile>;
}

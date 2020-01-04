import { WorkerService } from "../../../../services/worker-service";
import { GridParams } from "../../../grid-params";
import { GeoPolygon } from "../../geo-polygon";
import { GeoPoint, TileMercPoint, Point } from "../../../points";
export declare class IndexationWorker {
    worker: WorkerService;
    constructor();
    terminate(): void;
    indexatePoints(points: GeoPoint[], shape: GeoPolygon, params: GridParams): Promise<GeoPoint[]>;
    buildTile(tilePoint: TileMercPoint): Promise<Point[]>;
}

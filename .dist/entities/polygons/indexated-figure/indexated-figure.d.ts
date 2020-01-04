import { GridParams } from '../../grid-params';
import { GeoPoint } from '../../points/geo-point';
import { TileMercPoint } from '../../points/tile-merc-point';
import { Figure } from '../figure';
import { GeoPolygon } from '../geo-polygon';
import { Point } from '../../points';
import { IndexationWorker } from './utils/indexation-worker';
export declare class IndexatedFigure extends Figure {
    static indexWorker?: IndexationWorker;
    static fromShape(shape: GeoPolygon, params: GridParams, isInner?: boolean): Promise<IndexatedFigure>;
    fullPoints: GeoPolygon;
    constructor(points: GeoPoint[], shape: GeoPolygon, params: GridParams, isInner: boolean, fullPoints: GeoPolygon);
    tilePoints(tilePoint: TileMercPoint): Promise<Point[]>;
}

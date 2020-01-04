import { TileMercPoint } from '../points/tile-merc-point';
export declare class GridParams {
    static fromConfig({ isHorizontal, type, correction, cellSize, }: grider.GridConfig): GridParams;
    isHorizontal: boolean;
    type: grider.ShapeType;
    axes: grider.GridAxis[];
    geoAxes: grider.Axis[];
    initSize: number;
    initHeight: number;
    correction: grider.CorrectionType;
    constructor({ isHorizontal, type, axes, geoAxes, initSize, initHeight, correction, }: grider.GridParams);
    minCellSize(tilePoint: TileMercPoint): number;
    isEqual(params: GridParams): boolean;
    toPlain(): grider.GridParams;
    static fromPlain(params: grider.GridParams): GridParams;
}

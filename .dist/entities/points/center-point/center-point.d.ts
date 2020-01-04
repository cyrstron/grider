import { GridParams } from '../../grid-params';
import { CellSide } from '../../segments/cell-side';
import { GeoPoint } from '../geo-point';
import { GridPoint } from '../grid-point';
export declare class CenterPoint extends GridPoint {
    readonly neighbors: {
        south?: CenterPoint;
        north?: CenterPoint;
        west?: CenterPoint;
        east?: CenterPoint;
        southEast: CenterPoint;
        southWest: CenterPoint;
        northEast: CenterPoint;
        northWest: CenterPoint;
    };
    readonly northNeighbors: {
        north?: CenterPoint;
        northEast?: CenterPoint;
        northWest?: CenterPoint;
    };
    readonly southNeighbors: {
        south?: CenterPoint;
        southEast?: CenterPoint;
        southWest?: CenterPoint;
    };
    readonly westNeighbors: {
        west?: CenterPoint;
        northWest?: CenterPoint;
        southWest?: CenterPoint;
    };
    readonly eastNeighbors: {
        east?: CenterPoint;
        southEast?: CenterPoint;
        northEast?: CenterPoint;
    };
    readonly northEastNeighbors: {
        northEast: CenterPoint;
    };
    readonly southWestNeighbors: {
        southWest: CenterPoint;
    };
    readonly northWestNeighbors: {
        northWest: CenterPoint;
    };
    readonly southEastNeighbors: {
        southEast: CenterPoint;
    };
    static fromObject({ i, j, k }: grider.GridPoint, params: GridParams): CenterPoint;
    static fromGeo(point: GeoPoint, params: GridParams): CenterPoint;
    static fromGrid(point: GridPoint): CenterPoint;
    nextCenterByCellSide(cellSide: CellSide): CenterPoint;
    isNeighbor(center: CenterPoint): boolean;
    isCloserThroughAntiMeridian(center: CenterPoint): boolean;
    toOppositeHemishpere(): CenterPoint;
    moveByDiff(iDiff: number, jDiff: number): CenterPoint;
    toPlain(): grider.GridPoint;
    static fromPlain({ i, j, k }: grider.GridPoint, params: GridParams): CenterPoint;
}

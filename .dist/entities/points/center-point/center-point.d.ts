import { GridParams } from '../../grid-params';
import { CellSide } from '../../segments/cell-side';
import { GeoPoint } from '../geo-point';
import { GridPoint } from '../grid-point';
export declare class CenterPoint extends GridPoint {
    get neighbors(): {
        south?: CenterPoint;
        north?: CenterPoint;
        west?: CenterPoint;
        east?: CenterPoint;
        southEast: CenterPoint;
        southWest: CenterPoint;
        northEast: CenterPoint;
        northWest: CenterPoint;
    };
    get northNeighbors(): {
        north?: CenterPoint;
        northEast?: CenterPoint;
        northWest?: CenterPoint;
    };
    get southNeighbors(): {
        south?: CenterPoint;
        southEast?: CenterPoint;
        southWest?: CenterPoint;
    };
    get westNeighbors(): {
        west?: CenterPoint;
        northWest?: CenterPoint;
        southWest?: CenterPoint;
    };
    get eastNeighbors(): {
        east?: CenterPoint;
        southEast?: CenterPoint;
        northEast?: CenterPoint;
    };
    get northEastNeighbors(): {
        northEast: CenterPoint;
    };
    get southWestNeighbors(): {
        southWest: CenterPoint;
    };
    get northWestNeighbors(): {
        northWest: CenterPoint;
    };
    get southEastNeighbors(): {
        southEast: CenterPoint;
    };
    nextCenterByCellSide(cellSide: CellSide): CenterPoint;
    isNeighbor(center: CenterPoint): boolean;
    isCloserThroughAntiMeridian(center: CenterPoint): boolean;
    toOppositeHemishpere(): CenterPoint;
    moveByDiff(iDiff: number, jDiff: number): CenterPoint;
    static fromPlain({ i, j, k }: grider.GridPoint, params: GridParams): CenterPoint;
    static fromGeo(point: GeoPoint, params: GridParams): CenterPoint;
    static fromGrid(point: GridPoint): CenterPoint;
}

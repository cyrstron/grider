import { CenterPoint } from '../center-point';
export interface Neighbors {
    west?: grider.GridPoint;
    southWest: grider.GridPoint;
    east?: grider.GridPoint;
    southEast: grider.GridPoint;
    south?: grider.GridPoint;
    northEast: grider.GridPoint;
    north?: grider.GridPoint;
    northWest: grider.GridPoint;
}
export declare function getNorthWest(center: CenterPoint): {
    northWest: grider.GridPoint;
};
export declare function getNorthEast(center: CenterPoint): {
    northEast: grider.GridPoint;
};
export declare function getSouthWest(center: CenterPoint): {
    southWest: grider.GridPoint;
};
export declare function getSouthEast(center: CenterPoint): {
    southEast: grider.GridPoint;
};
export declare function getNorth(center: CenterPoint): {
    north?: grider.GridPoint;
    northEast?: grider.GridPoint;
    northWest?: grider.GridPoint;
};
export declare function getSouth(center: CenterPoint): {
    south?: grider.GridPoint;
    southEast?: grider.GridPoint;
    southWest?: grider.GridPoint;
};
export declare function getEast(center: CenterPoint): {
    east?: grider.GridPoint;
    southEast?: grider.GridPoint;
    northEast?: grider.GridPoint;
};
export declare function getWest(center: CenterPoint): {
    west?: grider.GridPoint;
    southWest?: grider.GridPoint;
    northWest?: grider.GridPoint;
};
export declare function getAll(center: CenterPoint): Neighbors;

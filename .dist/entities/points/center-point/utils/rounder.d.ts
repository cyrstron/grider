import { GridPoint } from '../../grid-point';
export declare function roundRectGridPoint(point: grider.PointRect): grider.PointRect;
export declare function calcPointDecimalRemains(point: {
    [key: string]: number;
}): grider.PointHex;
export declare function roundHexGridPoint(point: grider.PointHex): grider.PointHex;
export declare function round(point: GridPoint): grider.GridPoint;

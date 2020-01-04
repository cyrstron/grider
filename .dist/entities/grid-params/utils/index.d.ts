export declare const axesParams: {
    hex: [grider.GridAxis, grider.GridAxis, grider.GridAxis];
    rect: [grider.GridAxis, grider.GridAxis];
};
export declare const initCoofs: {
    hex: grider.InitCoofs;
    rect: grider.InitCoofs;
};
export declare function calcAxesParams(isHorizontal: boolean, type: grider.ShapeType): grider.Axis[];
export declare function calcInitialCellWidth(desiredSize: number, sizeCoof: number): number;
export declare function calcInitialCellHeight(desiredSize: number): number;

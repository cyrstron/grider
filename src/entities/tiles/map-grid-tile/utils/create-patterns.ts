import { TileMercPoint } from "../../../points/tile-merc-point";
import { GridPattern } from "../../grid-pattern";
import { GridParams } from "../../../grid-params";

export function createPatterns(
    tilePoint: TileMercPoint,
    params: GridParams,
): GridPattern[] {
    let start = tilePoint.gridPatternStartPoint(params);
    const {
        tileX,
        tileY,
        tileHeight,
        tileWidth,
        zoom,
    } = tilePoint

    if (params.correction === 'merc') {
        const pattern = GridPattern.fromTileCoords(tilePoint, start, params);

        return [
            pattern
        ];
    }

    const patterns: GridPattern[] = [];
    const yEnd = tileY + 1;

    while(start.tileY < yEnd) {
        const pattern = GridPattern.fromTileCoords(tilePoint, start, params);

        patterns.push(pattern);

        start = TileMercPoint.fromTile(
            tileX,
            pattern.end.tileY,
            tileWidth,
            tileHeight,
            zoom,
        );
    }

    return patterns;
}
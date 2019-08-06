import { GridParams } from '../../../../grid-params';
import { Point } from '../../../../points/point';
import { TileMercPoint } from '../../../../points/tile-merc-point';
import { GridPattern } from '../../../grid-pattern';

export function createPatterns(
    tilePoint: TileMercPoint,
    params: GridParams,
): GridPattern[] {
    let start: Point = tilePoint.gridPatternStartPoint(params);

    if (params.correction === 'merc') {
        const pattern = GridPattern.fromTileCoords(tilePoint, start, params);

        return [
            pattern,
        ];
    }

    const patterns: GridPattern[] = [];
    const yEnd = 1;

    while (start.y < yEnd) {
        const pattern = GridPattern.fromTileCoords(tilePoint, start, params);

        patterns.push(pattern);

        start = new Point(start.x, start.y + pattern.tile.tileHeight);
    }

    return patterns;
}

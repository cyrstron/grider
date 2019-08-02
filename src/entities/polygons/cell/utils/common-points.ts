import { GeoPoint } from '../../../points/geo-point';
import { Cell } from '../cell';

export function getCommonPoints(
    cellA: Cell,
    cellB: Cell,
): GeoPoint[] {
    const {params} = cellA.center;

    const isAntimeridian = cellA.center.isCloserThroughAntiMeridian(cellB.center);

    let diffI: number;
    let diffJ: number;

    if (isAntimeridian) {
        const oppositeA = cellA.center.toOppositeHemishpere();
        const oppositeB = cellB.center.toOppositeHemishpere();

        diffI = oppositeB.i - oppositeA.i;
        diffJ = oppositeB.j - oppositeA.j;
    } else {
        diffI = cellB.center.i - cellA.center.i;
        diffJ = cellB.center.j - cellA.center.j;
    }

    const indexes = params.type === 'hex' ?
        getHexCommonPointsIndexes(diffI, diffJ) :
        getRectCommonPointsIndexes(diffI, diffJ);

    return indexes.map((index) => cellA.points[index]);
}

function getRectCommonPointsIndexes(
    diffI: number,
    diffJ: number,
): number[] {
    if (diffI === 0 && diffJ === 0) {
        return [0, 1, 2, 3];
    } else if (diffI === 1 && diffJ === 0) {
        return [0, 1];
    } else if (diffI === -1 && diffJ === 0) {
        return [2, 3];
    } else if (diffI === 0 && diffJ === 1) {
        return [1, 2];
    } else if (diffI === 0 && diffJ === -1) {
        return [3, 0];
    } else if (diffI === 1 && diffJ === 1) {
        return [1];
    } else if (diffI === -1 && diffJ === 1) {
        return [2];
    } else if (diffI === -1 && diffJ === -1) {
        return [3];
    } else if (diffI === 1 && diffJ === -1) {
        return [0];
    } else {
        return [];
    }
}

function getHexCommonPointsIndexes(
    diffI: number,
    diffJ: number,
): number[] {
    if (diffI === 0 && diffJ === 0) {
        return [0, 1, 2, 3, 4, 5];
    } else if (diffI === 1 && diffJ === 0) {
        return [3, 4];
    } else if (diffI === -1 && diffJ === 0) {
        return [0, 1];
    } else if (diffI === 0 && diffJ === 1) {
        return [4, 5];
    } else if (diffI === 0 && diffJ === -1) {
        return [1, 2];
    } else if (diffI === -1 && diffJ === 1) {
        return [5, 0];
    } else if (diffI === 1 && diffJ === -1) {
        return [2, 3];
    } else {
        return [];
    }
}

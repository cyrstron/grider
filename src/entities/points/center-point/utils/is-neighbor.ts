import {CenterPoint} from '../center-point';

export function isHexNeighbor(
  {i: iA, j: jA, k: kA}: grider.GridPoint,
  {i: iB, j: jB, k: kB}: grider.GridPoint,
): boolean {
  const diffs = [
    iA - iB,
    jA - jB,
    (kA as number) - (kB as number),
  ];

  return diffs.includes(0) && diffs.includes(1) && diffs.includes(-1);
}

export function isRectNeighbor(
  {i: iA, j: jA}: grider.GridPoint,
  {i: iB, j: jB}: grider.GridPoint,
): boolean {
  const diffs = [Math.abs(iA - iB), Math.abs(jA - jB)];

  return diffs.includes(0) && diffs.includes(1);
}

export function isNeighbor(
  centerA: CenterPoint,
  centerB: CenterPoint,
): boolean {
  const {
    type,
  } = centerA.params;

  if (type === 'hex') {
    return isHexNeighbor(centerA, centerB);
  } else {
    return isRectNeighbor(centerA, centerB);
  }
}

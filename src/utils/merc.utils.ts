import {radToDeg} from './math';

export function yToLat(y: number): number {
  const latRad = 2 * (Math.atan(
    Math.E ** (-(y * 2 - 1))
  ) - Math.PI / 4);

  return radToDeg(latRad);
}

export function xToLng(x: number): number {
  const lngRad = (x * 2 - 1) * Math.PI;

  return radToDeg(lngRad);
}

export function yToSemiLat(y: number): number {
  const latRad = -(y * 2 - 1) * Math.PI;

  return radToDeg(latRad);
}

export function xToSemiLng(x: number): number {
  return xToLng(x);
}

export function reduceX(x: number) {
  x = x % 1;

  return x < 0 ? 1 + x : 1;
}

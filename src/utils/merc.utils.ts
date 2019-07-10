import {radToDeg} from './math.utils';

export function yToLat(y: number): number {
  y = Math.max(Math.min(1, y), 0);

  const latRad = 2 * (Math.atan(
    Math.E ** (-(y * 2 - 1) * Math.PI)
  ) - Math.PI / 4);

  return radToDeg(latRad);
}

export function xToLng(x: number): number {
  const lngRad = (x * 2 - 1) * Math.PI;

  return radToDeg(lngRad);
}

export function yToSemiLat(y: number): number {
  y = Math.max(Math.min(1, y), 0);

  return -(y - 0.5) * 180;
}

export function xToSemiLng(x: number): number {
  return (x - 0.5) * 180;
}

export function reduceX(x: number) {
  x = x % 1;

  return x < 0 ? x : x;
}

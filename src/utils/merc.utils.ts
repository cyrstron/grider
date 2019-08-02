import {radToDeg} from './math.utils';

export function yToLat(y: number): number {
  const latRad = (Math.atan(
    Math.E ** (-(y * 2 - 1) * Math.PI),
  ) - Math.PI / 4);

  return 2 * radToDeg(latRad);
}

export function xToLng(x: number): number {
  const lngRad = (x * 2 - 1) * Math.PI;

  return radToDeg(lngRad);
}

export function yToSemiLat(y: number): number {
  return -(y - 0.5) * 180;
}

export function xToSemiLng(x: number): number {
  return (x - 0.5) * 360;
}

export function reduceX(x: number) {
  x = x % 1;

  return x < 0 ? x : x;
}

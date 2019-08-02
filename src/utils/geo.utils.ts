import {degToRad} from './math.utils';

export function semiLatToY(lat: number): number {
  const y = -(lat / 180) + 0.5;

  return y;
}

export function semiLngToX(lng: number): number {
  return (lng / 360) + 0.5;
}

export function latToY(lat: number): number {
  const yRad = Math.log(
    Math.tan(
      (Math.PI / 4 + degToRad(lat) / 2),
    ),
  );

  return (-yRad / Math.PI + 1) / 2;
}

export function lngToX(lng: number): number {
  const xRad = degToRad(lng);

  return (xRad / Math.PI + 1) / 2;
}

export function formatLat(lat: number): number {
  if (lat > 90) {
    lat = 90;
  }

  if (lat < -90) {
    lat = -90;
  }

  return +lat.toFixed(7);
}

export function formatLng(lng: number): number {
  lng = reduceLng(lng);

  return +lng.toFixed(7);
}

export function reduceLat(lat: number): number {
  if (lat > 360 || lat < -360) {
    lat %= 360;
  }

  if (lat > 90) {
    return 180 - lat;
  } else if (lat < -90) {
    return -180 + lat;
  } else {
    return lat;
  }
}

export function reduceLng(lng: number): number {
  if (lng > 360 || lng < -360) {
    lng %= 360;
  }

  if (lng >= 180) {
    return lng - 360;
  } else if (lng < -180) {
    return lng + 360;
  } else {
    return lng;
  }
}

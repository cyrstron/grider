import {CenterPoint} from '../center-point';

export interface Neighbors {
  west?: grider.GridPoint;
  southWest: grider.GridPoint;
  east?: grider.GridPoint;
  southEast: grider.GridPoint;
  south?: grider.GridPoint;
  northEast: grider.GridPoint;
  north?: grider.GridPoint;
  northWest: grider.GridPoint;
}

export function getNorthWest(
  center: CenterPoint,
): {northWest: grider.GridPoint} {
  const {
    type,
    geoAxes,
  } = center.params;
  const mainGeoAxis = geoAxes[0].name;

  let {i, j} = center;
  const {k} = center;

  if (type === 'rect' && mainGeoAxis === 'lat') {
    i += 1;
    j -= 1;
  } else if (type === 'rect') {
    i -= 1;
    j += 1;
  } else if (type === 'hex' && mainGeoAxis === 'lat') {
    i += 1;
    j -= 1;
  } else {
    i -= 1;
    j += 1;
  }

  return {
    northWest: k === undefined ? {i, j} : {i, j, k},
  };
}

export function getNorthEast(
  center: CenterPoint,
): {northEast: grider.GridPoint} {
  const {
    type,
  } = center.params;

  let {i, j, k} = center;

  if (type === 'rect') {
    i += 1;
    j += 1;
  } else {
    i += 1;
    k = k as number - 1;
  }

  return {
    northEast: k === undefined ? {i, j} : {i, j, k},
  };
}

export function getSouthWest(
  center: CenterPoint,
): {southWest: grider.GridPoint} {
  const {
    type,
  } = center.params;

  let {i, j, k} = center;

  if (type === 'rect') {
    i -= 1;
    j -= 1;
  } else {
    i -= 1;
    k = k as number + 1;
  }

  return {
    southWest: k === undefined ? {i, j} : {i, j, k},
  };
}

export function getSouthEast(
  center: CenterPoint,
): {southEast: grider.GridPoint} {
  const {
    type,
    geoAxes,
  } = center.params;
  const mainGeoAxis = geoAxes[0].name;

  let {i, j} = center;
  const {k} = center;

  if (type === 'rect' && mainGeoAxis === 'lat') {
    i -= 1;
    j += 1;
  } else if (type === 'rect') {
    i += 1;
    j -= 1;
  } else if (type === 'hex' && mainGeoAxis === 'lat') {
    i -= 1;
    j += 1;
  } else {
    i += 1;
    j -= 1;
  }

  return {
    southEast: k === undefined ? {i, j} : {i, j, k},
  };
}

export function getNorth(
  center: CenterPoint,
): {
  north?: grider.GridPoint;
  northEast?: grider.GridPoint;
  northWest?: grider.GridPoint;
} {
  const {
    type,
    geoAxes,
  } = center.params;
  const mainGeoAxis = geoAxes[0].name;

  let {i, j, k} = center;

  if (type === 'rect' && mainGeoAxis === 'lat') {
    i += 1;
  } else if (type === 'rect') {
    j += 1;
  } else if (type === 'hex' && mainGeoAxis === 'lat') {
    j += 1;
    k = k as number - 1;
  } else {
    return {
      ...getNorthEast(center),
      ...getNorthWest(center),
    };
  }

  return {
    north: k === undefined ? {i, j} : {i, j, k},
  };
}

export function getSouth(
  center: CenterPoint,
): {
  south?: grider.GridPoint;
  southEast?: grider.GridPoint;
  southWest?: grider.GridPoint;
} {
  const {
    type,
    geoAxes,
  } = center.params;
  const mainGeoAxis = geoAxes[0].name;

  let {i, j, k} = center;

  if (type === 'rect' && mainGeoAxis === 'lat') {
    i -= 1;
  } else if (type === 'rect') {
    j -= 1;
  } else if (type === 'hex' && mainGeoAxis === 'lat') {
    j -= 1;
    k = k as number + 1;
  } else {
    return {
      ...getSouthEast(center),
      ...getSouthWest(center),
    };
  }

  return {
    south: k === undefined ? {i, j} : {i, j, k},
  };
}

export function getEast(
  center: CenterPoint,
): {
  east?: grider.GridPoint;
  southEast?: grider.GridPoint;
  northEast?: grider.GridPoint;
} {
  const {
    type,
    geoAxes,
  } = center.params;
  const mainGeoAxis = geoAxes[0].name;

  let {i, j, k} = center;

  if (type === 'rect' && mainGeoAxis === 'lat') {
    j += 1;
  } else if (type === 'rect') {
    i -= 1;
  } else if (type === 'hex' && mainGeoAxis === 'lat') {
    return {
      ...getSouthEast(center),
      ...getNorthEast(center),
    };
  } else {
    j += 1;
    k = k as number - 1;
  }

  return {
    east: k === undefined ? {i, j} : {i, j, k},
  };
}

export function getWest(
  center: CenterPoint,
): {
  west?: grider.GridPoint;
  southWest?: grider.GridPoint;
  northWest?: grider.GridPoint;
} {
  const {
    type,
    geoAxes,
  } = center.params;
  const mainGeoAxis = geoAxes[0].name;

  let {i, j, k} = center;

  if (type === 'rect' && mainGeoAxis === 'lat') {
    j -= 1;
  } else if (type === 'rect') {
    i += 1;
  } else if (type === 'hex' && mainGeoAxis === 'lat') {
    return {
      ...getSouthWest(center),
      ...getNorthWest(center),
    };
  } else {
    j -= 1;
    k = k as number + 1;
  }

  return {
    west: k === undefined ? {i, j} : {i, j, k},
  };
}


export function getAll(
  center: CenterPoint,
): Neighbors {
  const {
    type,
    geoAxes,
  } = center.params;

  const mainGeoAxis = geoAxes[0].name;

  if (type === 'hex' && mainGeoAxis === 'lat') {
    return {
      ...getNorth(center),
      ...getSouth(center),
      ...getSouthEast(center),
      ...getSouthWest(center),
      ...getNorthEast(center),
      ...getNorthWest(center),
    };
  } else if (type === 'hex') {
    return {
      ...getEast(center),
      ...getWest(center),
      ...getSouthEast(center),
      ...getSouthWest(center),
      ...getNorthEast(center),
      ...getNorthWest(center),
    };
  } else {
    return {
      ...getNorth(center),
      ...getSouth(center),
      ...getEast(center),
      ...getWest(center),
      ...getSouthEast(center),
      ...getSouthWest(center),
      ...getNorthEast(center),
      ...getNorthWest(center),
    };
  }
}

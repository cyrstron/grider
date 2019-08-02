import {CenterPoint} from '../center-point';

export interface Neighbors {
  west?: CenterPoint;
  southWest: CenterPoint;
  east?: CenterPoint;
  southEast: CenterPoint;
  south?: CenterPoint;
  northEast: CenterPoint;
  north?: CenterPoint;
  northWest: CenterPoint;
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
  }

  if (type === 'hex' && mainGeoAxis === 'lng') {
    return {
      ...getEast(center),
      ...getWest(center),
      ...getSouthEast(center),
      ...getSouthWest(center),
      ...getNorthEast(center),
      ...getNorthWest(center),
    };
  }

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

export function getNorthWest(
  center: CenterPoint,
): {northWest: CenterPoint} {
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
  } else if (type === 'rect' && mainGeoAxis === 'lng') {
    i -= 1;
    j += 1;
  } else if (type === 'hex' && mainGeoAxis === 'lat') {
    i += 1;
    j -= 1;
  } else if (type === 'hex' && mainGeoAxis === 'lng') {
    i -= 1;
    j += 1;
  }

  return {
    northWest: new CenterPoint(center.params, i, j, k),
  };
}

export function getNorthEast(
  center: CenterPoint,
): {northEast: CenterPoint} {
  const {
    type,
  } = center.params;

  let {i, j, k} = center;

  if (type === 'rect') {
    i += 1;
    j += 1;
  } else if (type === 'hex') {
    i += 1;
    k = k as number - 1;
  }

  return {
    northEast: new CenterPoint(center.params, i, j, k),
  };
}

export function getSouthWest(
  center: CenterPoint,
): {southWest: CenterPoint} {
  const {
    type,
  } = center.params;

  let {i, j, k} = center;

  if (type === 'rect') {
    i -= 1;
    j -= 1;
  } else if (type === 'hex') {
    i -= 1;
    k = k as number + 1;
  }

  return {
    southWest: new CenterPoint(center.params, i, j, k),
  };
}

export function getSouthEast(
  center: CenterPoint,
): {southEast: CenterPoint} {
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
  } else if (type === 'rect' && mainGeoAxis === 'lng') {
    i += 1;
    j -= 1;
  } else if (type === 'hex' && mainGeoAxis === 'lat') {
    i -= 1;
    j += 1;
  } else if (type === 'hex' && mainGeoAxis === 'lng') {
    i += 1;
    j -= 1;
  }

  return {
    southEast: new CenterPoint(center.params, i, j, k),
  };
}

export function getNorth(
  center: CenterPoint,
): {
  north?: CenterPoint,
  northEast?: CenterPoint,
  northWest?: CenterPoint,
} {
  const {
    type,
    geoAxes,
  } = center.params;
  const mainGeoAxis = geoAxes[0].name;

  let {i, j, k} = center;

  if (type === 'rect' && mainGeoAxis === 'lat') {
    i += 1;
  } else if (type === 'rect' && mainGeoAxis === 'lng') {
    j += 1;
  } else if (type === 'hex' && mainGeoAxis === 'lat') {
    j += 1;
    k = k as number - 1;
  } else if (type === 'hex' && mainGeoAxis === 'lng') {
    return {
      ...getNorthEast(center),
      ...getNorthWest(center),
    };
  }

  return {
    north: new CenterPoint(center.params, i, j, k),
  };
}

export function getSouth(
  center: CenterPoint,
): {
  south?: CenterPoint,
  southEast?: CenterPoint,
  southWest?: CenterPoint,
} {
  const {
    type,
    geoAxes,
  } = center.params;
  const mainGeoAxis = geoAxes[0].name;

  let {i, j, k} = center;

  if (type === 'rect' && mainGeoAxis === 'lat') {
    i -= 1;
  } else if (type === 'rect' && mainGeoAxis === 'lng') {
    j -= 1;
  } else if (type === 'hex' && mainGeoAxis === 'lng') {
    j -= 1;
    k = k as number + 1;
  } else if (type === 'hex' && mainGeoAxis === 'lat') {
    return {
      ...getSouthEast(center),
      ...getSouthWest(center),
    };
  }

  return {
    south: new CenterPoint(center.params, i, j, k),
  };
}

export function getEast(
  center: CenterPoint,
): {
  east?: CenterPoint,
  southEast?: CenterPoint,
  northEast?: CenterPoint,
} {
  const {
    type,
    geoAxes,
  } = center.params;
  const mainGeoAxis = geoAxes[0].name;

  let {i, j, k} = center;

  if (type === 'rect' && mainGeoAxis === 'lat') {
    j += 1;
  } else if (type === 'rect' && mainGeoAxis === 'lng') {
    i -= 1;
  } else if (type === 'hex' && mainGeoAxis === 'lng') {
    return {
      ...getSouthEast(center),
      ...getNorthEast(center),
    };
  } else if (type === 'hex' && mainGeoAxis === 'lat') {
    j += 1;
    k = k as number - 1;
  }

  return {
    east: new CenterPoint(center.params, i, j, k),
  };
}

export function getWest(
  center: CenterPoint,
): {
  west?: CenterPoint,
  southWest?: CenterPoint,
  northWest?: CenterPoint,
} {
  const {
    type,
    geoAxes,
  } = center.params;
  const mainGeoAxis = geoAxes[0].name;

  let {i, j, k} = center;

  if (type === 'rect' && mainGeoAxis === 'lat') {
    j -= 1;
  } else if (type === 'rect' && mainGeoAxis === 'lng') {
    i += 1;
  } else if (type === 'hex' && mainGeoAxis === 'lng') {
    return {
      ...getSouthWest(center),
      ...getNorthWest(center),
    };
  } else if (type === 'hex' && mainGeoAxis === 'lat') {
    j -= 1;
    k = k as number + 1;
  }

  return {
    west: new CenterPoint(center.params, i, j, k),
  };
}

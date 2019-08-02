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
    northWest: {i, j, k},
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
  } else if (type === 'hex') {
    i += 1;
    k = k as number - 1;
  }

  return {
    northEast: {i, j, k},
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
  } else if (type === 'hex') {
    i -= 1;
    k = k as number + 1;
  }

  return {
    southWest: {i, j, k},
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
    southEast: {i, j, k},
  };
}

export function getNorth(
  center: CenterPoint,
): {
  north?: grider.GridPoint,
  northEast?: grider.GridPoint,
  northWest?: grider.GridPoint,
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
    north: {i, j, k},
  };
}

export function getSouth(
  center: CenterPoint,
): {
  south?: grider.GridPoint,
  southEast?: grider.GridPoint,
  southWest?: grider.GridPoint,
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
    south: {i, j, k},
  };
}

export function getEast(
  center: CenterPoint,
): {
  east?: grider.GridPoint,
  southEast?: grider.GridPoint,
  northEast?: grider.GridPoint,
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
    east: {i, j, k},
  };
}

export function getWest(
  center: CenterPoint,
): {
  west?: grider.GridPoint,
  southWest?: grider.GridPoint,
  northWest?: grider.GridPoint,
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
    west: {i, j, k},
  };
}

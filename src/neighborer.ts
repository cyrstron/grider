import { Grider } from './grider';

export class Neighborer {
  constructor(
    public grider: Grider,
  ) {}
  getAll(
    cellCenter: grider.GridPoint,
    gridParams: grider.GridParams,
  ) {
    const {
      type,
      geoAxes,
    } = gridParams;

    const mainGeoAxis = geoAxes[0].name;

    if (type === 'hex' && mainGeoAxis === 'lat') {
      return {
        ...this.getNorth(cellCenter, gridParams),
        ...this.getSouth(cellCenter, gridParams),
        ...this.getSouthEast(cellCenter, gridParams),
        ...this.getSouthWest(cellCenter, gridParams),
        ...this.getNorthEast(cellCenter, gridParams),
        ...this.getNorthWest(cellCenter, gridParams),
      };
    }

    if (type === 'hex' && mainGeoAxis === 'lng') {
      return {
        ...this.getEast(cellCenter, gridParams),
        ...this.getWest(cellCenter, gridParams),
        ...this.getSouthEast(cellCenter, gridParams),
        ...this.getSouthWest(cellCenter, gridParams),
        ...this.getNorthEast(cellCenter, gridParams),
        ...this.getNorthWest(cellCenter, gridParams),
      };
    }

    if (type === 'rect') {
      return {
        ...this.getNorth(cellCenter, gridParams),
        ...this.getSouth(cellCenter, gridParams),
        ...this.getEast(cellCenter, gridParams),
        ...this.getWest(cellCenter, gridParams),
        ...this.getSouthEast(cellCenter, gridParams),
        ...this.getSouthWest(cellCenter, gridParams),
        ...this.getNorthEast(cellCenter, gridParams),
        ...this.getNorthWest(cellCenter, gridParams),
      };
    }

  }

  getNorthWest(
    cellCenter: grider.GridPoint,
    gridParams: grider.GridParams,
  ): {northWest: grider.GridPoint} {
    const {
      type,
      geoAxes,
    } = gridParams;
    const mainGeoAxis = geoAxes[0].name;

    const {i, j, k} = cellCenter;

    let result = {
      ...cellCenter,
    };

    if (type === 'rect' && mainGeoAxis === 'lat') {
      result = {
        i: i + 1,
        j: j - 1,
      };
    } else if (type === 'rect' && mainGeoAxis === 'lng') {
      result = {
        i: i - 1,
        j: j + 1,
      };
    } else if (type === 'hex' && mainGeoAxis === 'lat') {
      result = {
        i: i + 1,
        j: j - 1,
        k,
      };
    } else if (type === 'hex' && mainGeoAxis === 'lng') {
      result = {
        i: i - 1,
        j: j + 1,
        k,
      };
    }

    return {
      northWest: this.grider.reducePoint(result, gridParams),
    };
  }

  getNorthEast(
    cellCenter: grider.GridPoint,
    gridParams: grider.GridParams,
  ): {northEast: grider.GridPoint} {
    const {
      type,
      geoAxes,
    } = gridParams;
    const mainGeoAxis = geoAxes[0].name;

    const {i, j, k} = cellCenter;

    let result = {
      ...cellCenter,
    };

    if (type === 'rect') {
      result = {
        i: i + 1,
        j: j + 1,
      };
    } else if (type === 'hex') {
      result = {
        i: i + 1,
        j,
        k: k - 1,
      };
    }

    return {
      northEast: this.grider.reducePoint(result, gridParams),
    };
  }

  getSouthWest(
    cellCenter: grider.GridPoint,
    gridParams: grider.GridParams,
  ): {southWest: grider.GridPoint} {
    const {
      type,
      geoAxes,
    } = gridParams;
    const mainGeoAxis = geoAxes[0].name;

    const {i, j, k} = cellCenter;

    let result = {
      ...cellCenter,
    };

    if (type === 'rect') {
      result = {
        i: i - 1,
        j: j - 1,
      };
    } else if (type === 'hex') {
      result = {
        i: i - 1,
        j,
        k: k + 1,
      };
    }

    return {
      southWest: this.grider.reducePoint(result, gridParams),
    };
  }

  getSouthEast(
    cellCenter: grider.GridPoint,
    gridParams: grider.GridParams,
  ): {southEast: grider.GridPoint} {
    const {
      type,
      geoAxes,
    } = gridParams;
    const mainGeoAxis = geoAxes[0].name;

    const {i, j, k} = cellCenter;

    let result = {
      ...cellCenter,
    };

    if (type === 'rect' && mainGeoAxis === 'lat') {
      result = {
        i: i - 1,
        j: j + 1,
      };
    } else if (type === 'rect' && mainGeoAxis === 'lng') {
      result = {
        i: i + 1,
        j: j - 1,
      };
    } else if (type === 'hex' && mainGeoAxis === 'lat') {
      result = {
        i: i - 1,
        j: j + 1,
        k,
      };
    } else if (type === 'hex' && mainGeoAxis === 'lng') {
      result = {
        i: i + 1,
        j: j - 1,
        k,
      };
    }

    return {
      southEast: this.grider.reducePoint(result, gridParams),
    };
  }

  getNorth(
    cellCenter: grider.GridPoint,
    gridParams: grider.GridParams,
  ): {
    north?: grider.GridPoint,
    northEast?: grider.GridPoint,
    northWest?: grider.GridPoint,
  } {
    const {
      type,
      geoAxes,
    } = gridParams;
    const mainGeoAxis = geoAxes[0].name;

    const {i, j, k} = cellCenter;

    let result = {
      ...cellCenter,
    };

    if (type === 'rect' && mainGeoAxis === 'lat') {
      result = {
        i: i + 1,
        j,
      };
    } else if (type === 'rect' && mainGeoAxis === 'lng') {
      result = {
        i,
        j: j + 1,
      };
    } else if (type === 'hex' && mainGeoAxis === 'lng') {
      result = {
        i,
        j: j + 1,
        k: k - 1,
      };
    } else if (type === 'hex' && mainGeoAxis === 'lat') {
      return {
        ...this.getNorthEast(cellCenter, gridParams),
        ...this.getNorthWest(cellCenter, gridParams),
      };
    }

    return {
      north: this.grider.reducePoint(result, gridParams),
    };
  }

  getSouth(
    cellCenter: grider.GridPoint,
    gridParams: grider.GridParams,
  ): {
    south?: grider.GridPoint,
    southEast?: grider.GridPoint,
    southWest?: grider.GridPoint,
  } {
    const {
      type,
      geoAxes,
    } = gridParams;
    const mainGeoAxis = geoAxes[0].name;

    const {i, j, k} = cellCenter;

    let result = {
      ...cellCenter,
    };

    if (type === 'rect' && mainGeoAxis === 'lat') {
      result = {
        i: i - 1,
        j,
      };
    } else if (type === 'rect' && mainGeoAxis === 'lng') {
      result = {
        i,
        j: j - 1,
      };
    } else if (type === 'hex' && mainGeoAxis === 'lng') {
      result = {
        i,
        j: j - 1,
        k: k + 1,
      };
    } else if (type === 'hex' && mainGeoAxis === 'lat') {
      return {
        ...this.getSouthEast(cellCenter, gridParams),
        ...this.getSouthWest(cellCenter, gridParams),
      };
    }

    return {
      south: this.grider.reducePoint(result, gridParams),
    };
  }

  getEast(
    cellCenter: grider.GridPoint,
    gridParams: grider.GridParams,
  ): {
    east?: grider.GridPoint,
    southEast?: grider.GridPoint,
    northEast?: grider.GridPoint,
  } {
    const {
      type,
      geoAxes,
    } = gridParams;
    const mainGeoAxis = geoAxes[0].name;

    const {i, j, k} = cellCenter;

    let result = {
      ...cellCenter,
    };

    if (type === 'rect' && mainGeoAxis === 'lat') {
      result = {
        i,
        j: j + 1,
      };
    } else if (type === 'rect' && mainGeoAxis === 'lng') {
      result = {
        i: i - 1,
        j,
      };
    } else if (type === 'hex' && mainGeoAxis === 'lng') {
      return {
        ...this.getSouthEast(cellCenter, gridParams),
        ...this.getNorthEast(cellCenter, gridParams),
      };
    } else if (type === 'hex' && mainGeoAxis === 'lat') {
      result = {
        i,
        j: j + 1,
        k: k - 1,
      };
    }

    return {
      east: this.grider.reducePoint(result, gridParams),
    };
  }

  getWest(
    cellCenter: grider.GridPoint,
    gridParams: grider.GridParams,
  ): {
    west?: grider.GridPoint,
    southWest?: grider.GridPoint,
    northWest?: grider.GridPoint,
  } {
    const {
      type,
      geoAxes,
    } = gridParams;
    const mainGeoAxis = geoAxes[0].name;

    const {i, j, k} = cellCenter;

    let result = {
      ...cellCenter,
    };

    if (type === 'rect' && mainGeoAxis === 'lat') {
      result = {
        i,
        j: j - 1,
      };
    } else if (type === 'rect' && mainGeoAxis === 'lng') {
      result = {
        i: i + 1,
        j,
      };
    } else if (type === 'hex' && mainGeoAxis === 'lng') {
      return {
        ...this.getSouthWest(cellCenter, gridParams),
        ...this.getNorthWest(cellCenter, gridParams),
      };
    } else if (type === 'hex' && mainGeoAxis === 'lat') {
      result = {
        i,
        j: j - 1,
        k: k + 1,
      };
    }

    return {
      west: this.grider.reducePoint(result, gridParams),
    };
  }
}

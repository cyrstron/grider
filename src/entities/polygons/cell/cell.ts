import {GeoPolygon} from '../geo-polygon';
import {CenterPoint} from '../../points/center-point';
import {expand} from './utils/cell-expander';

export class Cell extends GeoPolygon {
  center: CenterPoint;

  constructor(
    center: CenterPoint
  ) {
    const points = expand(center);

    super(points);

    this.center = center;
  }

  get neighbors() {
    const {      
      west,
      southWest,
      east,
      southEast,
      south,
      northEast,
      north,
      northWest,
    } = this.center.neighbors;

    return {
      west: west && new Cell(west),
      southWest: new Cell(southWest),
      east: east && new Cell(east),
      southEast: new Cell(southEast),
      south: south && new Cell(south),
      northEast: new Cell(northEast),
      north: north && new Cell(north),
      northWest: new Cell(northWest),
    }
  }

  get northNeighbors() {
    const {
      northEast,
      north,
      northWest,
    } = this.center.northNeighbors;

    return {
      northEast: northEast && new Cell(northEast),
      north: north && new Cell(north),
      northWest: northWest && new Cell(northWest),
    }
  }

  get southNeighbors() {
    const {    
      southWest,
      southEast,
      south,
    } = this.center.southNeighbors;

    return {
      southWest: southWest && new Cell(southWest),
      southEast: southEast && new Cell(southEast),
      south: south && new Cell(south),
    }
  }

  get westNeighbors() {
    const {      
      west,
      southWest,
      northWest,
    } = this.center.westNeighbors;

    return {
      west: west && new Cell(west),
      southWest: southWest && new Cell(southWest),
      northWest: northWest && new Cell(northWest),
    }
  }

  get eastNeighbors() {
    const {      
      east,
      southEast,
      northEast,
    } = this.center.eastNeighbors;

    return {
      east: east && new Cell(east),
      southEast: southEast && new Cell(southEast),
      northEast: northEast && new Cell(northEast),
    }
  }

  get northEastNeighbors() {
    const {
      northEast,
    } = this.center.northEastNeighbors;

    return {
      northEast: new Cell(northEast),
    }
  }

  get southWestNeighbors() {
    const {      
      southWest,
    } = this.center.southWestNeighbors;

    return {
      southWest: new Cell(southWest),
    }
  }

  get northWestNeighbors() {
    const {
      northWest,
    } = this.center.northWestNeighbors;

    return {
      northWest: new Cell(northWest),
    }
  }

  get southEastNeighbors() {
    const {
      southEast,
    } = this.center.southEastNeighbors;

    return {
      southEast: new Cell(southEast),
    }
  }
}
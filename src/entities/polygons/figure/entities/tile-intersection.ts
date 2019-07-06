import { BoundIntersection } from "./bound-intersection";

export class TileIntersection {
  constructor(
    public north: BoundIntersection[],
    public south: BoundIntersection[],
    public east: BoundIntersection[],
    public west: BoundIntersection[],
  ) {}

  unite(intersection: TileIntersection): TileIntersection {
    return new TileIntersection(
      [...this.north, ...intersection.north],
      [...this.south, ...intersection.south],
      [...this.east, ...intersection.east],
      [...this.west, ...intersection.west],
    );
  }

  normalize(): TileIntersection {
    return new TileIntersection(
      [...this.north].sort(({intersection: {lat: latA}}, {intersection: {lat: latB}}) => latA - latB),
      [...this.south].sort(({intersection: {lat: latA}}, {intersection: {lat: latB}}) => latA - latB),
      [...this.east].sort(
        ({intersection: pointA}, {intersection: pointB}) => pointA.isCloserThroughAntiMeridian(pointB) ? 
          pointB.lng - pointA.lng : 
          pointA.lng - pointB.lng
      ),
      [...this.west].sort(
        ({intersection: pointA}, {intersection: pointB}) => pointA.isCloserThroughAntiMeridian(pointB) ? 
          pointB.lng - pointA.lng : 
          pointA.lng - pointB.lng
      ),
    )
  }

  get isEmpty(): boolean {
    return (
      this.north.length === 0
    ) && (
      this.south.length === 0
    ) && (
      this.east.length === 0
    ) && (
      this.west.length === 0
    );
  }
}
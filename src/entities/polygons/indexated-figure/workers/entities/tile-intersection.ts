import { TileMercPoint } from '../../../../points/tile-merc-point';
import { BoundIntersection } from './bound-intersection';
import { SplitGeoSegment } from './split-geo-segment';

type Intersects = {[key in grider.Cardinal]: SplitGeoSegment[]};

export class TileIntersection implements Intersects {

  get isContained(): boolean {
    return this.reduce((
      isContained: boolean,
      _segments,
      key,
    ): boolean => {
      if (!isContained) return isContained;

      return this.tileContainedByDirection(key);
    }, true);
  }

  get keys(): grider.Cardinal[] {
    return [
      'north',
      'east',
      'south',
      'west',
    ];
  }

  get isEmpty(): boolean {
    return this.reduce((
      isEmpty: boolean,
      segments,
    ): boolean => {
      if (!isEmpty) return isEmpty;

      return segments.length === 0;
    }, true);
  }

  get pointsIndexes(): number[] {
    return this.reduce((
      indexes: number[],
      segments,
    ): number[] => {
      return segments.reduce((
        indexes: number[], {boundA, boundB},
      ): number[] => {
        if (boundA.toIndex !== undefined) {
          indexes.push(boundA.toIndex);
        }
        if (boundB.toIndex !== undefined) {
          indexes.push(boundB.toIndex);
        }

        return indexes;
      }, indexes);
    }, [])
      .sort((a, b) => a - b);
  }

  static fromBounds(
    tilePoint: TileMercPoint,
    north: BoundIntersection[],
    south: BoundIntersection[],
    east: BoundIntersection[],
    west: BoundIntersection[],
  ): TileIntersection {
    return new TileIntersection(
      tilePoint,
      SplitGeoSegment.splitsByLng(north, 'north'),
      SplitGeoSegment.splitsByLng(south, 'south'),
      SplitGeoSegment.splitsByLat(east, 'east'),
      SplitGeoSegment.splitsByLat(west, 'west'),
    );
  }
  constructor(
    public tilePoint: TileMercPoint,
    public north: SplitGeoSegment[],
    public south: SplitGeoSegment[],
    public east: SplitGeoSegment[],
    public west: SplitGeoSegment[],
  ) {}

  normalize(): TileIntersection {
    return this.reduce((intersection, segments, direction) => {
      const bound = this.tilePoint[direction];

      intersection[direction] = segments.filter(
        (segment) => segment.overlapsSegment(bound),
      );

      return intersection;
    }, new TileIntersection(this.tilePoint, [], [], [], []));
  }

  forEach(
    callback: (segments: SplitGeoSegment[], cardinal: grider.Cardinal) => void,
  ): void {
    this.keys.forEach((key) => {
      callback(this[key], key);
    });
  }

  map<Result = SplitGeoSegment>(
    callback: (segments: SplitGeoSegment[], cardinal: grider.Cardinal) => Result,
  ): Result[] {
    return this.keys.map((key) => callback(this[key], key));
  }

  reduce<Result = SplitGeoSegment>(
    callback: (
      result: Result,
      segments: SplitGeoSegment[],
      cardinal: grider.Cardinal,
    ) => Result,
    result: Result,
  ): Result {
    return this.keys.reduce((result: Result, key) => callback(
      result,
      this[key],
      key,
    ), result);
  }

  tileContainedByDirection(direction: grider.Cardinal): boolean {
    const bound = this.tilePoint[direction];
    const segments = this[direction];

    return !!segments.find((segment) => segment.containsSegment(bound));
  }

  tileOverlappedByDirection(direction: grider.Cardinal): boolean {
    const bound = this.tilePoint[direction];
    const segments = this[direction];

    return !!segments.find((segment) => segment.overlapsSegment(bound));
  }
}

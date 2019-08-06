import { GeoSegment } from '../../../../segments/geo-segment';
import { BoundIntersection } from './bound-intersection';

export class SplitGeoSegment extends GeoSegment {

  static splitsByLng(
    bounds: BoundIntersection[],
    direction: grider.Cardinal,
  ): SplitGeoSegment[] {
    const isInverted = direction === 'north';
    const boundsByLng = bounds.reduce((boundsByLng, bound) => {
      boundsByLng[bound.intersection.lng] = bound;

      return boundsByLng;
    }, {} as {[key: number]: BoundIntersection});

    const intersects = bounds.map(({intersection}) => intersection);

    const splits = GeoSegment.segmentsFromPointsByLng(intersects);

    if (isInverted) {
      splits.reverse();
    }

    return splits.map(({pointA, pointB}) => new SplitGeoSegment(
      isInverted ? boundsByLng[pointB.lng] : boundsByLng[pointA.lng],
      isInverted ? boundsByLng[pointA.lng] : boundsByLng[pointB.lng],
    ));
  }

  static splitsByLat(
    bounds: BoundIntersection[],
    direction: grider.Cardinal,
  ): SplitGeoSegment[] {
    const isInverted = direction === 'west';
    const boundsByLat = bounds.reduce((boundsByLat, bound) => {
      boundsByLat[bound.intersection.lat] = bound;

      return boundsByLat;
    }, {} as {[key: number]: BoundIntersection});

    const intersects = bounds.map(({intersection}) => intersection);

    const splits = GeoSegment.segmentsFromPointsByLat(intersects);

    if (isInverted) {
      splits.reverse();
    }

    return splits.map(({pointA, pointB}) => new SplitGeoSegment(
      isInverted ? boundsByLat[pointB.lat] : boundsByLat[pointA.lat],
      isInverted ? boundsByLat[pointA.lat] : boundsByLat[pointB.lat],
    ));
  }

  constructor(
    public boundA: BoundIntersection,
    public boundB: BoundIntersection,
  ) {
    super(boundA.intersection, boundB.intersection);
  }
}

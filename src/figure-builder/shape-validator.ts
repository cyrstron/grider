import { Grider } from '..';
import { GeographyUtils, ShapeUtils } from '../utils';

export class ShapeValidator {
  constructor(
    public geography: GeographyUtils,
    public shape: ShapeUtils,
    public grider: Grider,
  ) {}

  validate(shape: grider.GeoPoint[]): boolean {
    const selfIntersects = this.getItselfIntersectsPoint(shape);

    if (selfIntersects.length > 0) return false;

    return true;
  }

  getItselfIntersectsPoint(shape: grider.GeoPoint[]): grider.GeoPoint[] {
    return this.geography.calcPolyItselfIntersections(shape);
  }
}

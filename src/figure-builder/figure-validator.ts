import { Grider } from '../';
import { GeographyUtils, ShapeUtils } from '../utils';

export class FigureValidator {
  constructor(
    public geography: GeographyUtils,
    public shape: ShapeUtils,
    public grider: Grider,
  ) {}

  getItselfIntersectsPoint(shape: grider.GeoPoint[]): grider.GeoPoint[] {
    return this.geography.calcPolyItselfIntersections(shape);
  }

  getOppositeIntersecedCells() {

  }
}

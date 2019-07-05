import {spreadPointsBySides} from './utils/spread-points';
import { GeoPoint } from '../../../../points/geo-point';
import {SideIndexation} from '../side-indexation';

export type SpreadedPoint = {index: number, point: GeoPoint};
export type SpreadedSide = SpreadedPoint[];
export type SpreadedFigure = SpreadedSide[];

export class Indexation {
  constructor(
    spreaded: SpreadedFigure,
    indexations: SideIndexation[],
  ) {}

  static fromPoints(points: GeoPoint[]) {
    const spreadedPoints = spreadPointsBySides(points);

    const indexations = spreadedPoints.map(
      (spreadedSide) => SideIndexation.fromSpreadedSide(spreadedSide)
    )

    return new Indexation(spreadedPoints, indexations);
  }
} 
import {spreadPointsBySides} from './utils/spread-points';
import { GeoPoint } from '../../../../points/geo-point';

export type SpreadedPoint = {index: number, point: GeoPoint};
export type SpreadedSide = SpreadedPoint[];
export type SpreadedFigure = SpreadedSide[];

export class Indexation {
    fromPoints(points: GeoPoint[]) {
      const spreadedPoints = spreadPointsBySides(points);
    }
} 
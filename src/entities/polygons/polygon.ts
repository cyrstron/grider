import {Point} from '../points/point';
import {Segment} from '../segments/segment';
import {GenericPolygon} from './generic-polygon';

export class Polygon extends GenericPolygon<Point, Segment> {
  sideByIndex(index: number): Segment {
    const {pointA, pointB} = super.sideByIndex(index);

    return new Segment(pointA, pointB);
  }
}

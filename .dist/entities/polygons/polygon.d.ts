import { Point } from '../points/point';
import { Segment } from '../segments/segment';
import { GenericPolygon } from './generic-polygon';
export declare class Polygon extends GenericPolygon<Point, Segment> {
    sideByIndex(index: number): Segment;
}

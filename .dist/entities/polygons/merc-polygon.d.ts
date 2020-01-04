import { MercPoint } from '../points/merc-point';
import { MercSegment } from '../segments/merc-segment';
import { GenericPolygon } from './generic-polygon';
export declare class MercPolygon extends GenericPolygon<MercPoint, MercSegment> {
    sideByIndex(index: number): MercSegment;
}

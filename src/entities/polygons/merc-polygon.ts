import {MercPoint} from '../points/merc-point';
import {MercSegment} from '../segments/merc-segment';
import {GenericPolygon} from './generic-polygon';

export class MercPolygon extends GenericPolygon<MercPoint, MercSegment> {
  sideByIndex(index: number): MercSegment {
    const {pointA, pointB} = super.sideByIndex(index);

    return new MercSegment(pointA, pointB);
  }
}

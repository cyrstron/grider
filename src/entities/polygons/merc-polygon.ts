import {GenericPolygon} from './generic-polygon';
import {MercPoint} from '../points/merc-point';
import {MercSegment} from '../segments/merc-segment';

export class Polygon extends GenericPolygon<MercPoint> {  
	sideByIndex(index: number): MercSegment {
    const {pointA, pointB} = super.sideByIndex(index);

    return new MercSegment(pointA, pointB);
	}
}
import {GenericPolygon} from './generic-polygon';
import {GeoPoint} from '../points/geo-point';
import {GeoSegment} from '../segments/geo-segment';

export class GeoPolygon extends GenericPolygon<GeoPoint, GeoSegment> {  
	sideByIndex(index: number): GeoSegment {
    const {pointA, pointB} = super.sideByIndex(index);

    return new GeoSegment(pointA, pointB);
  }
}
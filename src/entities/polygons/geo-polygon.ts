import {GenericPolygon} from './generic-polygon';
import {GeoPoint} from '../points/geo-point';
import {GeoSegment} from '../segments/geo-segment';

export class GeoPolygon extends GenericPolygon<GeoPoint, GeoSegment> {  
	sideByIndex(index: number): GeoSegment {
    const {pointA, pointB} = super.sideByIndex(index);

    return new GeoSegment(pointA, pointB);
  }

  splitSectionsByLat(lat: number): GeoSegment[] {
    const intersects = this.reduceSides((
      intersects: GeoPoint[],
      side: GeoSegment,
    ): GeoPoint[] => {
      const lng = side.lngByLat(lat);

      if (lng !== undefined) {
        const intersect = new GeoPoint(lat, lng);
        intersects.push(intersect);
      }

      return intersects;
    }, [])
      .sort(({lng: lngA}, {lng: lngB}) => lngA - lngB);

    const easternIndex = intersects.reduce((easternIndex, point, index) => {
      return intersects[easternIndex].isEasternTo(point) ? easternIndex : index;
    }, 0);

    return [
      ...intersects.slice(easternIndex),
      ...intersects.slice(0, easternIndex)
    ].reduce((
      splitSegments: GeoSegment[], 
      point, 
      index, 
      intersects
    ): GeoSegment[] => {
      if (index % 2) return splitSegments;

      const splitSegment = new GeoSegment(intersects[index - 1], point);

      splitSegments.push(splitSegment);

      return splitSegments;
    }, []);
  }

  polyContainsPoint(point: GeoPoint): boolean {
    const splitSegment = this.splitSectionsByLat(point.lat);

    return splitSegment.reduce((
      isContained,
      segment
    ) => isContained && segment.containsLng(point.lng) , false);
  }
  
	get easternPoint(): GeoPoint {
    return this.points.reduce((
        easternPoint,
        point,
      ) => point.isEasternTo(easternPoint) ? 
        point : 
        easternPoint, 
      this.points[0]
    );		
  }
  
	get westernPoint(): GeoPoint {
    return this.points.reduce((
        westernPoint,
        point,
      ) => point.isWesternTo(westernPoint) ? 
        point : 
        westernPoint, 
      this.points[0]
    );		
  }
  
	get northernPoint(): GeoPoint {
    return this.points.reduce((
        northernPoint,
        point,
      ) => point.isNorthernTo(northernPoint) ? 
        point : 
        northernPoint, 
      this.points[0]
    );		
  }
  
	get southernPoint(): GeoPoint {
    return this.points.reduce((
        southernPoint,
        point,
      ) => point.isSouthernTo(southernPoint) ? 
        point : 
        southernPoint, 
      this.points[0]
    );		
	}
}
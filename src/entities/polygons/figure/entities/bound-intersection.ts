import { GeoPoint } from "../../../points/geo-point";
import { GeoSegment } from "../../../segments/geo-segment";

export class BoundIntersection {
  constructor(
		public fromIndex: number,
		public fromPoint: GeoPoint,
		public toIndex: number,
		public toPoint: GeoPoint,
		public intersection: GeoPoint,
		public bound: number,
		public boundKey: grider.Cardinal,
	) {}

	static fromPoints(
		points: GeoPoint[],
		fromIndex: number,
		toIndex: number,
		bound: number,
		boundKey: grider.Cardinal,
	): BoundIntersection | undefined {
		const fromPoint = points[fromIndex];
		const toPoint = points[toIndex];

		let lat: number | undefined;
		let lng: number | undefined;

		const geoSegment = new GeoSegment(fromPoint, toPoint);

		if (boundKey === 'north' || boundKey === 'south') {
			lat = bound;
			lng = geoSegment.lngByLat(lat);
		} else {
			lng = bound;
			lat = geoSegment.latByLng(lng);
		}

		if (lat === undefined || lng === undefined) return;

		const intersection = new GeoPoint(lat, lng);

		return new BoundIntersection(
			fromIndex,
			fromPoint,
			toIndex,
			toPoint,
			intersection,
			bound,
			boundKey,
		);
	}
}

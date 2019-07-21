import { GeoPoint } from "../../../points/geo-point";
import { GeoSegment } from "../../../segments/geo-segment";
import { GeoPolygon } from "../../geo-polygon";

export class BoundIntersection {
  constructor(
		public intersection: GeoPoint,
		public bound: number,
		public boundKey: grider.Cardinal,
		public toIndex?: number,
		public toPoint?: GeoPoint,
	) {}

	static fromPoints(
		points: GeoPoint[],
		indexA: number,
		indexB: number,
		tilePoly: GeoPolygon,
		bound: number,
		boundKey: grider.Cardinal,
	): BoundIntersection | undefined {
		const pointA = points[indexA];
		const pointB = points[indexB];

		let lat: number | undefined;
		let lng: number | undefined;

		const geoSegment = new GeoSegment(pointA, pointB);

		if (boundKey === 'north' || boundKey === 'south') {
			lat = bound;
			lng = geoSegment.lngByLat(lat);
		} else {
			lng = bound;
			lat = geoSegment.latByLng(lng);
		}

		if (lat === undefined || lng === undefined) return;

		const intersection = new GeoPoint(lat, lng);

		let toPoint: GeoPoint | undefined;
		let toIndex: number | undefined;

		if (tilePoly.containsPoint(pointA)) {
			toPoint = pointA;
			toIndex = indexA;
		} else if (tilePoly.containsPoint(pointB)) {
			toPoint = pointB;
			toIndex = indexB;
		}

		return new BoundIntersection(
			intersection,
			bound,
			boundKey,
			toIndex,
			toPoint,
		);
	}
}

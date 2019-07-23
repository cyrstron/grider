import {GeoPolygon} from '../geo-polygon/geo-polygon';
import {CenterPoint} from '../../points/center-point';
import {CellSide} from '../../segments/cell-side';
import {GeoSegment} from '../../segments/geo-segment';
import { GeoPoint } from '../../points/geo-point';
import { GridPoint } from '../../points/grid-point';
import { GridParams } from '../../grid-params';
import { PeakPoint } from '../../points/peak-point';

import {expand} from './utils/cell-expander';
import {getIntersectedWithSegmentNeighbor} from './utils/intersected-neighbors'
import { TileMercPoint } from '../../points/tile-merc-point';

export class Cell extends GeoPolygon<CellSide> {
  center: CenterPoint;
  peaks: PeakPoint[];

  constructor(
    center: CenterPoint
  ) {
    const peaks = expand(center);

    super(peaks.map((peak) => peak.toGeo()));

    this.peaks = peaks;
    this.center = center;
  }

  findEqualGeoPoint(
    point: GeoPoint
  ): GeoPoint | undefined {
    return this.points
    .find((cellPoint) => cellPoint.isEqual(point));
  }

  intersectedWithSegmentNeighbor(
    segment: GeoSegment
  ): Cell | undefined {
    return getIntersectedWithSegmentNeighbor(this, segment);
  }

  intersectedWithSegmentsNeighbors(
    segments: GeoSegment[],
  ): Cell[] {
    return segments.reduce((
      intersectedCells: Cell[],
      segment: GeoSegment
    ): Cell[] => {
      const intersected = this.intersectedWithSegmentNeighbor(segment);

      if (intersected && !intersectedCells.find((cell) => cell.isEqual(intersected))) {
        intersectedCells.push(intersected)
      }

      return intersectedCells;
    }, []);
  }

  nearestPeaks(peak: PeakPoint): PeakPoint[] {
    const nearestPeaks = [];
    const prevPeak = this.prevPeak(peak);
    const nextPeak = this.nextPeak(peak);

    prevPeak && nearestPeaks.push(prevPeak);
    nextPeak && nearestPeaks.push(nextPeak);

    return nearestPeaks;
  }

  nearestPeaksGeo(peak: GeoPoint): GeoPoint[] {
    const nearestPeaks = [];
    const prevPeak = this.prevPeakGeo(peak);
    const nextPeak = this.nextPeakGeo(peak);

    prevPeak && nearestPeaks.push(prevPeak);
    nextPeak && nearestPeaks.push(nextPeak);

    return nearestPeaks;
  }

  prevPeak(peakPoint: PeakPoint): PeakPoint | undefined {
    const index = this.peaks.findIndex((point) => peakPoint.isEqual(point));

    if (index === -1) return;

    return this.prevPeakByIndex(index);
  }

  nextPeak(peakPoint: PeakPoint): PeakPoint | undefined {
    const index = this.peaks.findIndex((point) => peakPoint.isEqual(point));

    if (index === -1) return;

    return this.nextPeakByIndex(index);
  }

  prevPeakGeo(peakPoint: GeoPoint): GeoPoint | undefined {
    const index = this.points.findIndex((point) => peakPoint.isEqual(point));

    if (index === -1) return;

    return this.prevPointByIndex(index);
  }

  nextPeakGeo(peakPoint: GeoPoint): GeoPoint | undefined {
    const index = this.points.findIndex((point) => peakPoint.isEqual(point));

    if (index === -1) return;

    return this.nextPointByIndex(index);
  }

	nextPeakByIndex(index: number): PeakPoint {
		const nextIndex = this.nextIndex(index);    

		return this.peaks[nextIndex];
	}

	prevPeakByIndex(index: number): PeakPoint {
		const prevIndex = this.prevIndex(index);

		return this.peaks[prevIndex];
	}

  isEqual(cell: Cell): boolean {
    return this.center.isEqual(cell.center);
  }

  sideByIndex(index: number): CellSide {
    const {pointA, pointB} = super.sideByIndex(index);
    const indexA = this.points.indexOf(pointA);
    const indexB = this.points.indexOf(pointB);

    return new CellSide(
      pointA, 
      pointB, 
      this.peaks[indexA],
      this.peaks[indexB],
      this.center.params
    );
  }

  nextCellBySide(cellSide: CellSide) {
    const nextCenter = this.center.nextCenterByCellSide(cellSide);

    return new Cell(nextCenter);
  }

  containsPoint(point: GeoPoint): boolean {
    const center = point.toCenter(this.center.params);

    return this.center.isEqual(center);
  }

  nearestToEndIntersectedSide(segment: GeoSegment): CellSide | undefined {
    const {pointB: endPoint} = segment;

    if (this.containsPoint(endPoint)) return;

    const sidesByIntersectDistances = this.reduceSides((
      sidesByIntersectDistances: {[key: number]: CellSide},
      cellSide,
    ): {[key: number]: CellSide} => {
      const intersect = cellSide.intersectionPoint(segment);

      if (intersect) {
        const distance = endPoint.calcMercDistance(intersect);

        sidesByIntersectDistances[distance] = cellSide;
      }

      return sidesByIntersectDistances;
    }, {} as {[key: number]: CellSide});

    const distances = Object.keys(sidesByIntersectDistances)
      .map((distance) => +distance);

    if (distances.length === 0) return;

    const minDistance = Math.min(...distances);

    return sidesByIntersectDistances[minDistance];
  }

  nextCellOnSegment(segment: GeoSegment): Cell | undefined {
    const {
      pointA: startPoint,
      pointB: endPoint
    } = segment;

    if (startPoint.inSameCell(endPoint, this.center.params)) return;
    
    const nextSide = this.nearestToEndIntersectedSide(segment);

    if (!nextSide) return;

    return this.nextCellBySide(nextSide);
  }

  isNeighbor(cell: Cell): boolean {
    return this.center.isNeighbor(cell.center);
  } 

  get neighbors() {
    const {      
      west,
      southWest,
      east,
      southEast,
      south,
      northEast,
      north,
      northWest,
    } = this.center.neighbors;

    return {
      west: west && new Cell(west),
      southWest: new Cell(southWest),
      east: east && new Cell(east),
      southEast: new Cell(southEast),
      south: south && new Cell(south),
      northEast: new Cell(northEast),
      north: north && new Cell(north),
      northWest: new Cell(northWest),
    }
  }

  get northNeighbors() {
    const {
      northEast,
      north,
      northWest,
    } = this.center.northNeighbors;

    return {
      northEast: northEast && new Cell(northEast),
      north: north && new Cell(north),
      northWest: northWest && new Cell(northWest),
    }
  }

  get southNeighbors() {
    const {    
      southWest,
      southEast,
      south,
    } = this.center.southNeighbors;

    return {
      southWest: southWest && new Cell(southWest),
      southEast: southEast && new Cell(southEast),
      south: south && new Cell(south),
    }
  }

  get westNeighbors() {
    const {      
      west,
      southWest,
      northWest,
    } = this.center.westNeighbors;

    return {
      west: west && new Cell(west),
      southWest: southWest && new Cell(southWest),
      northWest: northWest && new Cell(northWest),
    }
  }

  get eastNeighbors() {
    const {      
      east,
      southEast,
      northEast,
    } = this.center.eastNeighbors;

    return {
      east: east && new Cell(east),
      southEast: southEast && new Cell(southEast),
      northEast: northEast && new Cell(northEast),
    }
  }

  get northEastNeighbors() {
    const {
      northEast,
    } = this.center.northEastNeighbors;

    return {
      northEast: new Cell(northEast),
    }
  }

  get southWestNeighbors() {
    const {      
      southWest,
    } = this.center.southWestNeighbors;

    return {
      southWest: new Cell(southWest),
    }
  }

  get northWestNeighbors() {
    const {
      northWest,
    } = this.center.northWestNeighbors;

    return {
      northWest: new Cell(northWest),
    }
  }

  get southEastNeighbors() {
    const {
      southEast,
    } = this.center.southEastNeighbors;

    return {
      southEast: new Cell(southEast),
    }
  }

  static fromGeoPoint(point: GeoPoint, params: GridParams): Cell {
    const cellCenter = point.toCenter(params);

    return new Cell(cellCenter);
  }

  static fromGridPoint(point: GridPoint) {
    const cellCenter = point.round();

    return new Cell(cellCenter);
  }

  static fromCenterPoint(point: CenterPoint) {
    return new Cell(point);
  }
}
import {spreadPointsBySides} from './utils/spread-points';
import { GeoPoint } from '../../../../points/geo-point';
import {SideIndexation} from '../side-indexation';
import { TileMercPoint } from '../../../../points/tile-merc-point';
import { TileIntersection } from '../tile-intersection';

export type SpreadedPoint = {index: number, point: GeoPoint};
export type SpreadedSide = SpreadedPoint[];
export type SpreadedFigure = SpreadedSide[];

export class Indexation {
  constructor(
    public points: GeoPoint[],
    public spreaded: SpreadedFigure,
    public indexations: SideIndexation[],
  ) {}

  tileIntersection(tilePoint: TileMercPoint) {
    return this.indexations.reduce((
      resultTile: TileIntersection, 
      sideIndexation,
    ): TileIntersection => {
      const tileIntersects = sideIndexation.tileIntersection(tilePoint);

      return tileIntersects ? resultTile.unite(tileIntersects) : resultTile;
    }, new TileIntersection([], [], [], []));
  }

  tileBorderPoints(tilePoint: TileMercPoint): GeoPoint[] {
    const tileIntersects = this.tileIntersection(tilePoint);

    if (tileIntersects.isEmpty) return [];

    const normalized = tileIntersects.normalize();

    return [];
  }

  static fromPoints(points: GeoPoint[]) {
    const spreadedPoints = spreadPointsBySides(points);

    const indexations = spreadedPoints.map(
      (spreadedSide) => SideIndexation.fromSpreadedSide(points, spreadedSide)
    )

    return new Indexation(points, spreadedPoints, indexations);
  }
} 
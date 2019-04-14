import { FigureBuilder } from './figure-builder';
import { GridRenderer } from './grid-renderer';
import { Grider } from './grider';
import { Neighborer } from './neighborer';

export class StaticGrider {
  constructor(
    public grider: Grider,
    public figureBuilder: FigureBuilder,
    public neighbors: Neighborer,
    public params: grider.GridParams,
    public gridRenderer: GridRenderer,
  ) {}

  buildPolyByGeoPoint(geoPoint: grider.GeoPoint): grider.GeoPoint[] {
    return this.grider.buildPolyByGeoPoint(
      geoPoint,
      this.params,
    );
  }

  buildPolyByCenterGridPoint(
    centerGridPoint: grider.PointHex | grider.PointRect,
  ): grider.GeoPoint[] {
    return this.grider.buildPolyByCenterGridPoint(
      centerGridPoint,
      this.params,
    );
  }

  calcGridCenterPointByGeoPoint(
    geoPoint: grider.GeoPoint,
  ): grider.PointHex | grider.PointRect {
    return this.grider.calcGridCenterPointByGeoPoint(
      geoPoint,
      this.params,
    );
  }
  buildFigure(poly: grider.GeoPoint[], isInner: boolean = true): grider.GeoPoint[] {
    return this.figureBuilder.buildFigure(poly, this.params, isInner);
  }

  buildOuterFigure(poly: grider.GeoPoint[]): grider.GeoPoint[] {
    return this.figureBuilder.buildOuterFigure(poly, this.params);
  }
  buildInnerFigure(poly: grider.GeoPoint[]): grider.GeoPoint[] {
    return this.figureBuilder.buildInnerFigure(poly, this.params);
  }

  getNorthWest(cellCenter: grider.GridPoint) {
    return this.neighbors.getNorthWest(cellCenter, this.params);
  }

  getSouthWest(cellCenter: grider.GridPoint) {
    return this.neighbors.getSouthWest(cellCenter, this.params);
  }

  getNorthEast(cellCenter: grider.GridPoint) {
    return this.neighbors.getNorthEast(cellCenter, this.params);
  }

  getSouthEast(cellCenter: grider.GridPoint) {
    return this.neighbors.getSouthEast(cellCenter, this.params);
  }

  getNorth(cellCenter: grider.GridPoint) {
    return this.neighbors.getNorth(cellCenter, this.params);
  }

  getSouth(cellCenter: grider.GridPoint) {
    return this.neighbors.getSouth(cellCenter, this.params);
  }

  getEast(cellCenter: grider.GridPoint) {
    return this.neighbors.getEast(cellCenter, this.params);
  }

  getWest(cellCenter: grider.GridPoint) {
    return this.neighbors.getWest(cellCenter, this.params);
  }

  calcGridConfig(
    tileCoords: grider.Point,
    zoomCoofX: number,
    zoomCoofY: number,
  ): grider.GridTileConfig {
    return this.gridRenderer.calcConfig(tileCoords, zoomCoofX, zoomCoofY, this.params);
  }

  calcMinCellSize(
    zoomCoofX: number,
  ): number {
    return this.gridRenderer.calcMinCellSize(zoomCoofX, this.params);
  }
}

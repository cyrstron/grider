import { Grider } from '../';
import { GeographyUtils, MathUtils } from '../utils';
import { Neighborer } from './../neighborer';
import { TileBuilder } from './tile-builder';

export class GridRenderer {
  constructor(
    public grider: Grider,
    public tileBuilder: TileBuilder,
    public geography: GeographyUtils,
    public math: MathUtils,
    public neighbors: Neighborer,
  ) {}

  calcConfig(
    tileCoords: grider.Point,
    zoomCoofX: number,
    zoomCoofY: number,
    gridParams: grider.GridParams,
  ): grider.GridTileConfig {
    const delta = this.calcStartDelta(tileCoords, zoomCoofX, zoomCoofY, gridParams);

    if (gridParams.correction === 'merc') {
      return {
        patterns: this.calcMercTiles(tileCoords, zoomCoofX, zoomCoofY, delta, gridParams),
      };
    } else {
      return {
        patterns: this.calcNoneTiles(tileCoords, zoomCoofX, zoomCoofY, delta, gridParams),
      };
    }
  }

  calcStartDelta(
    tileCoords: grider.Point,
    zoomCoofX: number,
    zoomCoofY: number,
    gridParams: grider.GridParams,
  ): grider.Point {
    const {x, y} = tileCoords;

    const northWestCorner: grider.Point = {
      x: x / zoomCoofX,
      y: y / zoomCoofY,
    };

    const tileTopLeftGeo = this.geography.mercToSpherMap(northWestCorner);
    const gridCenter = this.grider.calcGridCenterPointByGeoPoint(tileTopLeftGeo, gridParams);

    const {northWest} = this.neighbors.getNorthWest(gridCenter, gridParams);

    const nwCenterGeo = this.grider.calcGeoPointByGridPoint(northWest, gridParams);
    const patternTopLeft = this.geography.spherToMercMap(nwCenterGeo);

    return {
      x: (patternTopLeft.x - northWestCorner.x) * zoomCoofX,
      y: (patternTopLeft.y - northWestCorner.y) * zoomCoofY,
    };
  }

  calcMercTiles(
    tileCoords: grider.Point,
    zoomCoofX: number,
    zoomCoofY: number,
    delta: grider.Point,
    gridParams: grider.GridParams,
  ): grider.GridPatternConfig[] {
    const patternConfig = this.calcPatternConfig(
      tileCoords,
      zoomCoofX,
      zoomCoofY,
      delta,
      gridParams,
    );

    const start = {
      ...delta,
    };

    const end = {
      x: 1,
      y: 1,
    };

    return [{
      patternConfig,
      start,
      end,
    }];
  }

  calcMinCellSize(
    zoomCoofX: number,
    gridParams: grider.GridParams,
  ) {
    const {initSize, initHeight, isHorizontal} = gridParams;
    const cellSize = isHorizontal ? initSize : initHeight;
    const initSizeDeg = cellSize / 10000000;

    return initSizeDeg * zoomCoofX / 360;
  }

  calcNoneTiles(
    tileCoords: grider.Point,
    zoomCoofX: number,
    zoomCoofY: number,
    delta: grider.Point,
    gridParams: grider.GridParams,
  ): grider.GridPatternConfig[] {
    const tileConfig: grider.GridPatternConfig[] = [];
    let yTo = delta.y;

    while (yTo < 1) {
      const prevPattern = tileConfig[tileConfig.length - 1];
      const patternTopLeft = prevPattern ? {
        x: delta.x,
        y: prevPattern.end.y,
      } : delta;

      const patternConfig = this.calcPatternConfig(
        tileCoords,
        zoomCoofX,
        zoomCoofY,
        patternTopLeft,
        gridParams,
      );

      tileConfig.push({
        patternConfig,
        start: {
          x: delta.x,
          y: yTo,
        },
        end: {
          x: 1,
          y: yTo + patternConfig.heightRel,
        },
      });

      yTo += patternConfig.heightRel;
    }

    return tileConfig;
  }

  calcPatternConfig(
    tileCoords: grider.Point,
    zoomCoofX: number,
    zoomCoofY: number,
    patternTopLeft: grider.Point,
    gridParams: grider.GridParams,
  ): grider.PatternConfig {
    const xFrom = patternTopLeft.x;
    const yFrom = patternTopLeft.y;

    const patternTopLeftTile = {
      x: tileCoords.x + xFrom,
      y: tileCoords.y + yFrom,
    };

    const patternTopLeftGeo = this.geography.mercToSpherMap({
      x: patternTopLeftTile.x / zoomCoofX,
      y: patternTopLeftTile.y / zoomCoofY,
    });
    const patternGridTopLeft = this.grider.calcGridCenterPointByGeoPoint(patternTopLeftGeo, gridParams);

    const {southEast: patternGridCenter} = this.neighbors.getSouthEast(patternGridTopLeft, gridParams);
    const patternGeoCenter = this.grider.calcGeoPointByGridPoint(patternGridCenter, gridParams);
    const {southEast: patternGridBottomRight} = this.neighbors.getSouthEast(patternGridCenter, gridParams);

    const patternGeoBottomRight = this.grider.calcGeoPointByGridPoint(patternGridBottomRight, gridParams);
    const patternMercBottomRight = this.geography.spherToMercMap(patternGeoBottomRight);
    const patternTileBottomRight = {
      x: patternMercBottomRight.x * zoomCoofX - tileCoords.x,
      y: patternMercBottomRight.y * zoomCoofY - tileCoords.y,
    };

    const widthRel = patternTileBottomRight.x - xFrom;
    const heightRel = patternTileBottomRight.y - yFrom;

    const patternPoints = this.tileBuilder.buildTile(patternGeoCenter, gridParams);
    const patterPointsRel = patternPoints.map((polyline) => (
      polyline.map((point) => {
        const pointMerc = this.geography.spherToMercMap(point);

        return {
          x: ((pointMerc.x * zoomCoofX) - patternTopLeftTile.x) / (widthRel),
          y: ((pointMerc.y * zoomCoofY) - patternTopLeftTile.y) / (heightRel),
        };
      })
    ));

    return {
      pattern: patterPointsRel,
      widthRel,
      heightRel,
    };
  }
}

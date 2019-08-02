import { GridParams } from '../../../grid-params';
import { CenterPoint } from '../../../points/center-point';
import { GeoPoint } from '../../../points/geo-point';
import { GridPoint } from '../../../points/grid-point';
import { Point } from '../../../points/point';
import { TileMercPoint } from '../../../points/tile-merc-point';

export function expandTile(
  geoPoint: GeoPoint,
  startTilePoint: TileMercPoint,
  tileWidth: number,
  tileHeight: number,
  params: GridParams,
): Point[][] {
  const {
    northWestNeighbors: {northWest},
  } = CenterPoint.fromGeo(geoPoint, params);

  let gridTilePoints: grider.GridPoint[][];

  if (params.type === 'hex') {
    gridTilePoints = expandHexTile(northWest);
  } else {
    gridTilePoints = expandRectTile(northWest);
  }

  return gridTilePoints.map((points) => points
    .map(({i, j, k}): Point => {
      const mercPoint = new GridPoint(params, i, j, k).toGeo().toMerc();

      const tilePoint = TileMercPoint.fromMerc(
        mercPoint,
        startTilePoint.tileWidth,
        startTilePoint.tileHeight,
        startTilePoint.zoom,
      );

      let xDiff = tilePoint.tileX - startTilePoint.tileX;

      if (xDiff > 1) {
        const xDiffAlter = Math.abs(
          Math.ceil(tilePoint.tileX) - (tilePoint.tileX - startTilePoint.tileX),
        );

        xDiff = Math.min(xDiff, xDiffAlter);
      }

      const x = (xDiff) / tileWidth;
      const y = (tilePoint.tileY - startTilePoint.tileY) / tileHeight;

      return new Point(x, y);
    }),
  );
}

function expandRectTile(
  {i, j, params}: GridPoint,
) {
  if (!params.isHorizontal) {
    return [
      [{
        i: i - 0.5,
        j,
      }, {
        i: i - 0.5,
        j: j + 2,
      }],
      [{
        i,
        j: j + 0.5,
      }, {
        i: i - 2,
        j: j + 0.5,
      }],
      [{
        i: i - 1.5,
        j,
      }, {
        i: i - 1.5,
        j: j + 2,
      }],
      [{
        i,
        j: j + 1.5,
      }, {
        i: i - 2,
        j: j + 1.5,
      }],
    ];
  } else {
    return [
      [{
        i,
        j: j - 0.5,
      }, {
        i: i + 2,
        j: j - 0.5,
      }],
      [{
        i: i + 0.5,
        j,
      }, {
        i: i + 0.5,
        j: j - 2,
      }],
      [{
        i: i + 1.5,
        j,
      }, {
        i: i + 1.5,
        j: j - 2,
      }],
      [{
        i,
        j: j - 1.5,
      }, {
        i: i + 2,
        j: j - 1.5,
      }],
    ];
  }
}

function expandHexTile(
  northWest: GridPoint,
) {
  const {i, j, params} = northWest;
  const k = northWest.k as number;

  if (params.isHorizontal) {
    return [
      [{
        i,
        j: j - 0.5,
        k: k + 0.5,
      }, {
        i: i + 1 / 3,
        j: j - 2 / 3,
        k: k + 1 / 3,
      }, {
        i: i + 2 / 3,
        j: j - 1 / 3,
        k: k - 1 / 3,
      }, {
        i: i + 4 / 3,
        j: j - 2 / 3,
        k: k - 2 / 3,
      }, {
        i: i + 5 / 3,
        j: j - 4 / 3,
        k: k - 1 / 3,
      }, {
        i: i + 2,
        j: j - 1.5,
        k: k - 0.5,
      }],
      [{
        i: i + 1 / 3,
        j: j - 2 / 3,
        k: k + 1 / 3,
      }, {
        i: i + 2 / 3,
        j: j - 4 / 3,
        k: k + 2 / 3,
      }, {
        i: i + 4 / 3,
        j: j - 5 / 3,
        k: k + 1 / 3,
      }, {
        i: i + 5 / 3,
        j: j - 4 / 3,
        k: k - 1 / 3,
      }],
    ];
  } else {
    return [
      [{
        i,
        j: j + 0.5,
        k: k - 0.5,
      }, {
        i: i - 1 / 3,
        j: j + 2 / 3,
        k: k - 1 / 3,
      }, {
        i: i - 2 / 3,
        j: j + 1 / 3,
        k: k + 1 / 3,
      }, {
        i: i - 4 / 3,
        j: j + 2 / 3,
        k: k + 2 / 3,
      }, {
        i: i - 5 / 3,
        j: j + 4 / 3,
        k: k + 1 / 3,
      }, {
        i: i - 2,
        j: j + 1.5,
        k: k + 0.5,
      }],
      [{
        i: i - 1 / 3,
        j: j + 2 / 3,
        k: k - 1 / 3,
      }, {
        i: i - 2 / 3,
        j: j + 4 / 3,
        k: k - 2 / 3,
      }, {
        i: i - 4 / 3,
        j: j + 5 / 3,
        k: k - 1 / 3,
      }, {
        i: i - 5 / 3,
        j: j + 4 / 3,
        k: k + 1 / 3,
      }],
    ];
  }
}

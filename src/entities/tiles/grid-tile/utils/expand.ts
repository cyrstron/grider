import { GridPoint } from "../../../points/grid-point";
import { GeoPoint } from "../../../points/geo-point";
import { GridParams } from "../../../grid-params";
import { MercPoint } from "../../../points/merc-point";
import { TileMercPoint } from "../../../points/tile-merc-point";

export function expandTile(
  geoPoint: GeoPoint,
  tilePoint: TileMercPoint,
  params: GridParams,
): TileMercPoint[][] {
  const {northWestNeighbors: {northWest}} = geoPoint.toCenter(params);

  let gridTilePoints: grider.GridPoint[][];

  if (params.type === 'hex') {
    gridTilePoints = expandHexTile(northWest);
  } else {
    gridTilePoints = expandRectTile(northWest);
  }

  return gridTilePoints.map((points) => points
    .map(({i, j, k}) => {
      const mercPoint = new GridPoint(params, i, j, k).toGeo().toMerc();

      return TileMercPoint.fromMerc(
        mercPoint, 
        tilePoint.tileWidth,
        tilePoint.tileHeight,
        tilePoint.zoom,
      );
    })
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
  northWest: GridPoint
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
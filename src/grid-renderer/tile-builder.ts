import { Grider } from '../';
import { Neighborer } from '../neighborer';

export class TileBuilder {
  constructor(
    public grider: Grider,
    public neighbors: Neighborer,
  ) {}

  buildTile(
    geoPoint: grider.GeoPoint,
    gridParams: grider.GridParams,
  ): grider.GeoPoint[][] {
    const {type} = gridParams;
    const gridCenter = this.grider.calcGridCenterPointByGeoPoint(geoPoint, gridParams);
    const {northWest} = this.neighbors.getNorthWest(gridCenter, gridParams);

    let gridTile: grider.GridPoint[][] | undefined;

    if (type === 'hex') {
      gridTile = this.buildHexTile(northWest as grider.PointHex, gridParams);
    } else {
      gridTile = this.buildRectTile(northWest as grider.PointRect, gridParams);
    }

    return gridTile.map((polyLine) => polyLine.map(
      (gridPoint) => this.grider.calcGeoPointByGridPoint(gridPoint, gridParams)),
    );
  }

  buildRectTile(
    {i, j}: grider.PointRect,
    {isHorizontal}: grider.GridParams,
  ): grider.PointRect[][] {
    if (!isHorizontal) {
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

  buildHexTile(
    {i, j, k}: grider.PointHex,
    {isHorizontal}: grider.GridParams,
  ): grider.PointRect[][] {
    if (isHorizontal) {
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
}

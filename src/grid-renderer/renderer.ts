import { Grider } from '../';
import { GeographyUtils } from '../utils';
import { Neighborer } from './../neighborer';
import { TileBuilder } from './tile-builder';

class GridRenderer {
  constructor(
    public grider: Grider,
    public tileBuilder: TileBuilder,
    public geography: GeographyUtils,
    public neighbors: Neighborer,
  ) {}

  calcConfig(
    {x, y}: grider.Point,
    zoom: number,
    gridParams: grider.GridParams,
  ) {
    const zoomCoof = Math.pow(2, zoom);

    const northWestCorner: grider.Point = {
      x: x / zoomCoof,
      y: y / zoomCoof,
    };
    const southEastCorner: grider.Point = {
      x: (x + 1) / zoomCoof,
      y: (y + 1) / zoomCoof,
    };

    const tileTopLeftGeo = this.geography.mercToSpherMap(northWestCorner);
    const gridCenter = this.grider.calcGridCenterPointByGeoPoint(tileTopLeftGeo, gridParams);

    const {northWest} = this.neighbors.getNorthWest(gridCenter, gridParams);
    const nwCenterGeo = this.grider.calcGeoPointByGridPoint(northWest, gridParams);
    const patternTopLeft = this.geography.spherToMercMap(nwCenterGeo);

    const delta = {
      x: (northWestCorner.x - patternTopLeft.x) * zoomCoof,
      y: (northWestCorner.y - patternTopLeft.y) * zoomCoof,
    };
  }
}

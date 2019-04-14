import { GeographyUtils } from '../utils';

export class BorderRenderer {
  constructor(
    public figure: grider.GeoPoint[],
    public shape: grider.GeoPoint[],
    public geography: GeographyUtils,
  ) {}

  calcBorderTileFigure(
    tileCoord: grider.Point,
    zoomCoofX: number,
    zoomCoofY: number,
  ) {
    const tileGeoShape = this.calcTileShape(tileCoord, zoomCoofX, zoomCoofY);

    const contains = tileGeoShape.map(
      (point) => this.geography.polyContainsPoint(this.shape, point),
    );

    if (contains.every((isContained) => !isContained)) {
      return [];
    } else {
      return [{
        x: 0,
        y: 0,
      }, {
        x: 1,
        y: 0,
      }, {
        x: 1,
        y: 1,
      }, {
        x: 0,
        y: 1,
      }];
    }
  }

  calcTileShape(
    tileCoord: grider.Point,
    zoomCoofX: number,
    zoomCoofY: number,
  ): grider.GeoPoint[] {
    const bottomRightTile = {
      x: tileCoord.x + 1,
      y: tileCoord.y + 1,
    };
    const northWest = this.geography.mercToSpherMap({
      x: tileCoord.x / zoomCoofX,
      y: tileCoord.y / zoomCoofY,
    });
    const southEast = this.geography.mercToSpherMap({
      x: bottomRightTile.x / zoomCoofX,
      y: bottomRightTile.y / zoomCoofY,
    });

    return [
      northWest, {
        lat: northWest.lat,
        lng: southEast.lng,
      },
      southEast, {
        lat: southEast.lat,
        lng: northWest.lng,
      },
    ];
  }
}

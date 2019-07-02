import { GridParams } from "../../grid-params";
import { GeoPoint } from "../../points/geo-point";

import {expandTile} from './utils/expand';

export class GridTile {
  constructor(
    public points: GeoPoint[][], 
    public params: GridParams 
  ) {}

  fromGeo(point: GeoPoint, params: GridParams): GridTile {
    const points = expandTile(point, params);

    return new GridTile(points, params);
  }
}
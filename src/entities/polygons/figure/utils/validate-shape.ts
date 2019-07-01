import { GeoPolygon } from "../../geo-polygon/geo-polygon";
import { GridParams } from "../../../grid-params";

export function validateShape(
  shape: GeoPolygon,
  params: GridParams
): boolean {
  if (shape.points.length < 3) return false;

  if (shape.selfIntersections.length > 0) return false;


}


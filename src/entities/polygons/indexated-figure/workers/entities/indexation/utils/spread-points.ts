import { GeoPoint } from '../../../../../../points/geo-point';
import { GeoSegment } from '../../../../../../segments/geo-segment';
import {SpreadedFigure} from '../indexation';

export function spreadPointsBySides(
  points: GeoPoint[],
) {
  const spreadedPoints = points.slice(0, -1)
    .reduce((
      spreadedPoints: SpreadedFigure,
      point,
      pointIndex,
      points,
    ): SpreadedFigure => {
      const sidePoints = spreadedPoints[spreadedPoints.length - 1];

      if (!sidePoints) {
        const lastPointIndex = points.length - 1;
        const lastPoint = points[lastPointIndex];

        return [[{
          index: lastPointIndex,
          point: lastPoint,
        }, {
          point,
          index: pointIndex,
        }]];
      }

      const checkSegment = new GeoSegment(
        sidePoints[0].point,
        sidePoints[sidePoints.length - 1].point,
      );

      const latIsOK = !checkSegment.containsLat(point.lat);
      const lngIsOK = !checkSegment.containsLng(point.lng);

      if (latIsOK && lngIsOK) {
        sidePoints.push({
          index: pointIndex,
          point,
        });
      } else {
        spreadedPoints.push([
          sidePoints[sidePoints.length - 1],
          {
            index: pointIndex,
            point,
          },
        ]);
      }

      return spreadedPoints;
    }, []);

  return spreadedPoints;
}

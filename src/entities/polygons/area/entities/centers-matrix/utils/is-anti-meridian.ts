import { CenterPoint } from "../../../../../points";

export function isOnAntiMeridian(centers: CenterPoint[]): boolean {
  let eastern: CenterPoint = centers[0];
  let western: CenterPoint = centers[0];

  centers.forEach((center) => {
    if (center.isEasternTo(eastern)) {
      eastern = center;
    }

    if (center.isEasternTo(western)) {
      eastern = center;
    }
  });

  return eastern.isCloserThroughAntiMeridian(western);
}
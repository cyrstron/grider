import {constants} from '../../../constants';
import {calcClosestMultiple} from '../../../utils/math.utils';

const SIN60 = Math.sqrt(3) / 2;

export const axesParams: {
  hex: [grider.GridAxis, grider.GridAxis, grider.GridAxis],
  rect: [grider.GridAxis, grider.GridAxis],
} = {
  get hex(): [grider.GridAxis, grider.GridAxis, grider.GridAxis] {
    return [{
      name: 'i',
      angle: 0,
    }, {
      name: 'j',
      angle: 120,
    }, {
      name: 'k',
      angle: 240,
    }];
  },
  get rect(): [grider.GridAxis, grider.GridAxis] {
    return [{
      name: 'i',
      angle: 0,
    }, {
      name: 'j',
      angle: 90,
    }];
  },
};

export const initCoofs: {
  hex: grider.InitCoofs,
  rect: grider.InitCoofs,
} = {
  hex: {
    get merc(): grider.InitCoof {
      return {
        vertical: SIN60 * 0.5,
        horizontal: 0.5,
      };
    },
    get none(): grider.InitCoof {
      return {
        vertical: SIN60,
        horizontal: 1,
      };
    },
    get area(): grider.InitCoof {
      return {
        vertical: SIN60,
        horizontal: 1,
      };
    },
  },
  rect: {
    get merc(): grider.InitCoof {
      return {
        vertical: 0.5,
        horizontal: 0.5,
      };
    },
    get none(): grider.InitCoof {
      return {
        vertical: 1,
        horizontal: 1,
      };
    },
    get area(): grider.InitCoof {
      return {
        vertical: 2,
        horizontal: 1 / 2,
      };
    },
  },
};

export function calcAxesParams(
  isHorizontal: boolean,
  type: grider.ShapeType,
): grider.Axis[] {
  let angle;

  switch (type) {
    case 'hex':
      angle = 120;
      break;
    case 'rect':
    default:
      angle = 90;
      break;
  }

  const mainAxis = isHorizontal ? 'lng' : 'lat';
  const auxAxis = isHorizontal ? 'lat' : 'lng';

  return [
    {
      name: mainAxis,
      angle: 0,
    },
    {
      name: auxAxis,
      angle,
    },
  ];
}

export function calcInitialCellWidth(
  desiredSize: number,
  sizeCoof: number,
): number {
  const minWidth = constants.equatorLength / 3600000000;
  const relPolyWidth = Math.round(desiredSize / minWidth);
  let result = calcClosestMultiple(relPolyWidth, 3600000000);

  if (result > 1800000000) {
    result = 1800000000;
  }

  if (result < 1) {
    result = 1;
  }

  return result * sizeCoof;
}

export function calcInitialCellHeight(desiredSize: number): number {
  const minWidth = constants.meridianLength / 3600000000;
  const relPolyWidth = Math.round(desiredSize / minWidth);

  let result = calcClosestMultiple(relPolyWidth, 1800000000);

  if (result > 1800000000) {
    result = 1800000000;
  }

  if (result < 1) {
    result = 1;
  }

  return result;
}

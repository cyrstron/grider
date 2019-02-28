export class AxisScaler {
  toGridScale(value: number, gridParams: grider.GridParams): number {
    const size = gridParams.initSize;
    const result = value * 10000000 / size;

    return result;
  }

  toGeoScale(value: number, gridParams: grider.GridParams): number {
    const size = gridParams.initSize;
    const result = value * size / 10000000;

    return result;
  }
}

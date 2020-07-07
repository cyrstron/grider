import {CenterPoint} from './center-point';
import {GridParams} from '../../grid-params';

function createParams(config: Partial<grider.GridConfig> = {}): GridParams {
  return GridParams.fromConfig({
    type: 'rect',
    cellSize: 10000,
    correction: 'none',
    ...config,
  });
}

describe('constructor', () => {
  it('should return PeakPoint instance', () => {
    const gridParams = createParams();
    const point = new CenterPoint(gridParams, 1, 2);

    expect(point).toBeInstanceOf(CenterPoint);
  });
});

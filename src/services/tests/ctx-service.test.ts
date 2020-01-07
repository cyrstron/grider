import {WebWorkerMock} from '../../tests/mocks/web-worker-mock';
import {CtxService} from '../ctx-service';

function createCtxService(
  worker: WebWorkerMock = new WebWorkerMock(),
): CtxService {
  return new CtxService(worker);
}

describe('instance', () => {
  describe('instance creation', () => {
    it('should create CtxService instance', () => {
      const ctx = createCtxService();

      expect(ctx).toBeInstanceOf(CtxService);
    });

    describe('worker events subscription', () => {
      const worker = new WebWorkerMock();
      createCtxService(worker);

      it('should add message listener', () => {
        expect(worker.listeners['message']).toHaveProperty('0');
      });

      it('should add error listener', () => {
        expect(worker.listeners['error']).toHaveProperty('0');
      });
    });
  });

  it('should remove listeners on terminate event', () => {
    const worker = new WebWorkerMock();
    createCtxService(worker);
    const messageEvent = new MessageEvent('message', {
      data: 'terminate',
    });

    worker.dispatchEvent(messageEvent);

    expect(worker.listeners['message']).toStrictEqual([]);
    expect(worker.listeners['error']).toStrictEqual([]);
  });
});

describe('onMessage', () => {
  it('should add message listener', () => {
    const worker = new WebWorkerMock();
    const ctx = createCtxService(worker);
    const mockListener = jest.fn();
    const messageEvent = new MessageEvent('message', {
      data: 'message',
    });

    ctx.onMessage(mockListener);
    worker.dispatchEvent(messageEvent);

    const mockMessage = mockListener.mock.calls[0][0];

    expect(mockMessage).toBeInstanceOf(MessageEvent);
    expect(mockMessage).toBe(messageEvent);
  });
});

describe('onError', () => {
  it('should add error listener', () => {
    const worker = new WebWorkerMock();
    const ctx = createCtxService(worker);
    const mockListener = jest.fn();
    const errorEvent = new ErrorEvent('error', {
      error: 'error',
    });

    ctx.onError(mockListener);
    worker.dispatchEvent(errorEvent);

    const mockError = mockListener.mock.calls[0][0];

    expect(mockError).toBeInstanceOf(ErrorEvent);
    expect(mockError.error).toBe('error');
  });
});

describe('post', () => {
  it('should post messages', () => {
    const workerSpy = jest.spyOn(WebWorkerMock.prototype, 'postMessage');
    const worker = new WebWorkerMock();
    const ctx = createCtxService(worker);

    ctx.post('message');

    expect(workerSpy).toHaveBeenCalledWith('message');

    workerSpy.mockReset();
  });
});

describe('close', () => {
  it('should remove all listeners', () => {
    const worker = new WebWorkerMock();
    const ctx = createCtxService(worker);

    ctx.close();

    expect(worker.listeners['message']).toStrictEqual([]);
    expect(worker.listeners['error']).toStrictEqual([]);
  });
});

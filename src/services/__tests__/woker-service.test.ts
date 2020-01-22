// eslint-disable-next-line jest/no-mocks-import
import {WebWorkerMock} from '../../__mocks__/web-worker-mock';
import {WorkerService, WorkerMessage} from '../worker-service';

function createWorkerService(
  worker: Worker = new WebWorkerMock(),
): WorkerService {
  return new WorkerService(worker);
}

function createMessage(type: string, payload: string): WorkerMessage<string> {
  return {
    type,
    payload,
  };
}

function createMessageEvent(message: string): MessageEvent {
  return {
    type: 'message',
    data: message,
  } as MessageEvent;
}

function createErrorEvent(error: string): ErrorEvent {
  return {
    type: 'error',
    error: error,
  } as ErrorEvent;
}

describe('instance', () => {
  it('should create WorkerService instance', () => {
    const workerService = createWorkerService();

    expect(workerService).toBeInstanceOf(WorkerService);
  });
});

describe('post', () => {
  it('should post messages', () => {
    const postSpy = jest.spyOn(WebWorkerMock.prototype, 'postMessage');
    const worker = new WebWorkerMock();
    const workerService = createWorkerService(
      worker,
    );

    const message = createMessage('message', 'payload');

    workerService.post(message);

    expect(postSpy.mock.calls[0][0]).toBe(message);

    postSpy.mockReset();
  });

  describe('asynchronous tasks management', () => {
    it('should return a promise', () => {
      const workerService = createWorkerService();
      const message = {
        type: 'message',
        payload: 'payload',
      };

      expect(workerService.post(message)).toBeInstanceOf(Promise);
    });

    it('should resolve post promise on dispatch', async () => {
      const worker = new WebWorkerMock();
      const workerService = createWorkerService(worker);
      const message = createMessage('message', 'payload');
      const responseEvent = createMessageEvent('response');

      const promise = workerService.post(message);

      worker.dispatchEvent(responseEvent);

      const {data} = await promise;

      expect(data).toBe('response');
    });

    it('should reject post promise on error', async () => {
      const worker = new WebWorkerMock();
      const workerService = createWorkerService(worker);
      const message = createMessage('message', 'payload');
      const responseError = createErrorEvent('error');

      const promise = workerService.post(message);

      worker.dispatchEvent(responseError);

      await expect(promise).rejects.toStrictEqual(responseError);
    });
  });

  describe('multiple tasks', () => {
    it('should resolve promises in correct order', async () => {
      const worker = new WebWorkerMock();
      const workerService = createWorkerService(worker);
      const messages = [
        createMessage('message', 'message1'),
        createMessage('message', 'message2'),
        createMessage('message', 'message3'),
      ];
      const responses = [
        createMessageEvent('1'),
        createMessageEvent('2'),
        createMessageEvent('3'),
      ];

      const promises = messages.map((message) => workerService.post(message));

      responses.forEach((response) => {
        worker.dispatchEvent(response);
      });

      const resolved = await Promise.all(promises);

      expect(resolved).toStrictEqual(responses);
    });
  });
});

describe('close', () => {
  it('should remove all event listeners', () => {
    const worker = new WebWorkerMock();
    const ctx = createWorkerService(worker);
    ctx.close();

    expect(worker.listeners['message']).toStrictEqual([]);
    expect(worker.listeners['error']).toStrictEqual([]);
  });
});

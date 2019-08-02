import {CtxService} from './ctx-service';

export class WorkerService<PostMessage> extends CtxService<PostMessage> {
  private postQueue: PostMessage[] = [];
  private runningTaskMessage: PostMessage | null = null;

  private resolves: Map<
    PostMessage,
    (e: MessageEvent) => void
  > = new Map();
  private rejects: Map<
    PostMessage,
    (e: ErrorEvent) => void
  > = new Map();

  post(message: PostMessage): Promise<MessageEvent> {
    if (!this.runningTaskMessage) {
      this.runningTaskMessage = message;
      super.post(message);
    } else {
      this.postQueue.push(message);
    }

    return new Promise<MessageEvent>((res, rej) => {
      this.resolves.set(message, res);
      this.rejects.set(message, rej);
    });
  }

  nextTask() {
    if (this.postQueue.length === 0) {
      this.runningTaskMessage = null;
    } else {
      const nextTask = this.postQueue[0];

      this.runningTaskMessage = nextTask;
      this.postQueue.shift();

      super.post(nextTask);
    }
  }

  messageHandler = (event: MessageEvent) => {
    const endedTask = this.runningTaskMessage as PostMessage;
    const resolve = this.resolves.get(endedTask);

    if (resolve) {
      resolve(event);
    }

    this.clearMessage(endedTask);
    this.nextTask();
  }

  errorHandler = (event: ErrorEvent) => {
    const endedTask = this.runningTaskMessage as PostMessage;
    const reject = this.rejects.get(endedTask);

    if (reject) {
      reject(event);
    }

    this.clearMessage(endedTask);
    this.nextTask();
  }

  clearMessage(message: PostMessage) {
    this.resolves.delete(message);
    this.rejects.delete(message);
  }

  unmount() {
    this.resolves = new Map();
    this.rejects = new Map();
    this.postQueue = [];
    this.runningTaskMessage = null;

    super.unmount();
  }
}

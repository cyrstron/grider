import { CtxService } from './ctx-service';
export declare class WorkerService extends CtxService {
    private postQueue;
    private runningTaskMessage;
    private resolves;
    private rejects;
    post(message: any): Promise<MessageEvent>;
    nextTask(): void;
    messageHandler: (event: MessageEvent) => void;
    errorHandler: (event: ErrorEvent) => void;
    clearMessage(message: any): void;
    terminate(): void;
    unmount(): void;
}

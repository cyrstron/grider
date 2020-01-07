import { CtxService } from './ctx-service';
export interface WorkerMessage<Payload = any> {
    type: string;
    payload: Payload;
}
export declare class WorkerService extends CtxService {
    private postQueue;
    private runningTaskMessage;
    private resolves;
    private rejects;
    post<Payload = any>(message: WorkerMessage<Payload>): Promise<MessageEvent>;
    private nextTask;
    protected messageHandler: (event: MessageEvent) => void;
    protected errorHandler: (event: ErrorEvent) => void;
    private clearMessage;
    close(): void;
}

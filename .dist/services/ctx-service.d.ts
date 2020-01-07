export declare class CtxService {
    worker: Worker;
    protected messageHandler?: (e: MessageEvent) => void;
    protected errorHandler?: (e: ErrorEvent) => void;
    constructor(worker: Worker);
    post(message: any): void;
    onMessage(callback: (e: MessageEvent) => void): void;
    onError(callback: (e: ErrorEvent) => void): void;
    close(): void;
    protected unmount(): void;
    private handleMessage;
    private handleError;
}

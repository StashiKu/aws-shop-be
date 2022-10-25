export type Exception = {
    code: string;
    time?: string;
    requestId?: string;
    statusCode: number;
    retryable?: boolean;
    retryDelay?: number;
    message: string;
}

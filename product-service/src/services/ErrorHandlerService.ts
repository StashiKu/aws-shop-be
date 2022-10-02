import { formatJsonResponse } from "../shared/utils";

export const handleError = (error) => {
    let statusCode: number = error.statusCode || 500;
    let message: string = error.message || 'Internal Server Error.';

    return formatJsonResponse(statusCode, { error: message });
}

import { formatJsonResponse } from "../shared/utils";

export const handleError = (error) => {
    const statusCode: number = error.statusCode || 500;
    const message: string = error.message || 'Internal Server Error.';

    return formatJsonResponse(statusCode, { error: message });
}

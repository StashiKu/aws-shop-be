import { formatJSONResponse } from "@libs/api-gateway";

export const handleError = (error) => {
    const statusCode: number = error.statusCode || 500;
    const message: string = error.message || 'Internal Server Error.';

    return formatJSONResponse(statusCode, { error: message });
}

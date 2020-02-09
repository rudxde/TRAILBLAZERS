import { IServiceErrors } from '@tb/interfaces';

export class NotAuthorizedError extends Error implements IServiceErrors {
    public isNotAuthorizedError = true;
    public isServiceError: true = true;
    public statusCode = 401;
    constructor() {
        super(`NotAuthorizedError - 401`);
    }
}

export class BadRequestError extends Error implements IServiceErrors {
    public isBadRequestError = true;
    public isServiceError: true = true;
    public statusCode = 400;
    constructor() {
        super(`BadRequestError - 400`);
    }
}

export class NotFoundError extends Error implements IServiceErrors {
    public isServiceError: true = true;
    public statusCode = 404;
    constructor() {
        super(`BadRequestError - 404`);
    }
}

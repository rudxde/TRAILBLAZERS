/**
 * Represents an error of an service.
 *
 * @export
 * @interface IServiceErrors
 */
export interface IServiceErrors {
    /**
     * The http-status-code, which represents the error
     *
     * @type {number}
     * @memberof IServiceErrors
     */
    statusCode: number;
    /**
     * makes it possible to check if the error is an ```IServiceErrors```
     * 
     * ```ts
     * if(err.isServiceError) {
     *   status = err.statusCode;
     * } else {
     *   status = 500;
     * }
     * ```
     *
     * @type {true}
     * @memberof IServiceErrors
     */
    isServiceError: true;
}

import { IUserProfile, ILogin } from '.';

/**
 * The registration-request send to the user-service.
 *
 * @export
 * @interface IRegistration
 * @extends {IUserProfile} requires to contain the UserProfile
 * @extends {ILogin} requires to contain the Login-Data
 */
export interface IRegistration extends IUserProfile, ILogin {
    /**
     * Does the user accept the terms and conditions.
     * 
     * Needs to be true.
     *
     * @type {boolean}
     * @memberof IRegistration
     */
    acceptAgbs: boolean;
}

/**
 * The registration-request sent from the user-service to the auth service, to create the login.
 *
 * @export
 * @interface IAuthRegistration
 * @extends {ILogin}
 */
export interface IAuthRegistration extends ILogin {
    /**
     * New created user-id.
     *
     * @type {string}
     * @memberof IAuthRegistration
     */
    userid: string;
}

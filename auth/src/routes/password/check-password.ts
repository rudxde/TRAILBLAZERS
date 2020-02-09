import { Auth } from '@tb/interfaces';
import { hashUserPasswordWithSalt, NotAuthorizedError } from '@tb/service-utils';
/**
 * Checks if the given password is correct. Throws ```NotAuthorizedError``` if not.
 *
 * @param {Auth.IAuth} auth
 * @param {string} password
 * @returns {Promise<void>}
 */
export async function checkPassword(auth: Auth.IAuth, password: string): Promise<void> {
    const checkHash = hashUserPasswordWithSalt(password, auth.salt);
    if (checkHash !== auth.hash)
        throw new NotAuthorizedError();
}

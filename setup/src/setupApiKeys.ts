import crypto from 'crypto';
import fs from 'fs';
import { environment } from '@tb/environment/dist/service';

/**
 * Creates a public and private key pair for each service.
 *
 * @export
 */
export function setupKeys(): void {
    if (!fs.existsSync('/usr/src/app/keys')) fs.mkdirSync('/usr/src/app/keys');
    if (!fs.existsSync('/usr/src/app/keys/public')) fs.mkdirSync('/usr/src/app/keys/public');
    environment.api.all.forEach(x => createKeys(x.name));
}

function createKeys(apiName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        crypto.generateKeyPair('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        }, (err, publicKey, privateKey) => {
            if (err) reject(err);
            fs.writeFileSync(`/usr/src/app/keys/public/${apiName}.pub`, publicKey, { encoding: 'utf-8' });
            fs.writeFileSync(`/usr/src/app/keys/${apiName}.pem`, privateKey, { encoding: 'utf-8' });
            resolve();
        });
    });
}

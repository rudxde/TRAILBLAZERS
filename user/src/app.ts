import { environment } from '@tb/environment/dist/service';
import { IApiDef, IApiDefMongo } from '@tb/interfaces';
import fs from 'fs';

export const apiDef: IApiDef & IApiDefMongo = environment.api.user;
export const publicKeys: {service: string, publicKey: string}[] = environment.api.all.map(
    (service: IApiDef) => ({ service: service.name, publicKey: fs.readFileSync(`/usr/src/app/keys/public/${service.name}.pub`).toString('utf8') }),
);
export const privateKey: string = fs.readFileSync(`/usr/src/app/keys/${apiDef.name}.pem`).toString('utf8');

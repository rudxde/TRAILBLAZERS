import { IRegistration, Auth, IUserProfile, IAuthRegistration } from '@tb/interfaces';
import { mongoConnection } from '../mongoconnection';
import { request } from '@tb/service-utils';
import { privateKey, apiDef } from '../../app';
import { environment } from '@tb/environment/dist/service';
import { checkUserProfile } from '../update-profile';

export async function Register(registration: IRegistration): Promise<Auth.ICertifiedUserToken> {
    checkRegistration(registration);
    let userid: string;
    return mongoConnection('user', async db => {
        const userCollection = db.collection('user');
        const lastIdUser = await userCollection.find<IUserProfile>({}).sort({ id: -1 }).limit(1).next();
        if (lastIdUser != null) {
            const nextId = parseInt(lastIdUser.id, 16) + 1;
            userid = nextId.toString(16);
        } else {
            userid = '0';
        }
        await userCollection.insertOne(<Partial<IUserProfile>>{
            email: registration.email,
            firstName: registration.firstName,
            hikesCompleted: [],
            id: userid,
            lastName: registration.lastName,
            nickName: registration.nickName,
            personalScores: {},
            picturePath: '',
            rank: 0,
        });
        return request<Auth.ICertifiedUserToken>(
            {
                method: 'post',
                from: apiDef,
                to: environment.api.auth,
                route: '/register',
                body: <IAuthRegistration>{
                    login: registration.login,
                    password: registration.password,
                    userid: userid!,
                }
            },
            privateKey,
        )
            .catch(err => {
                // remove account
                userCollection.deleteOne({
                    id: userid,
                }).then(() => console.log('deleted user after error in auth service'));
                throw err;
            });
    });
}

function checkRegistration(registration: IRegistration): void {
    checkUserProfile(registration);
    if (!registration.nickName.match(/^[A-Za-z0-9\-\_\.\!\/]*$/)) throw new ValidationError();
}

export class ValidationError {

}

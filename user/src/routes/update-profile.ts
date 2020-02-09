import { IUserProfile } from '@tb/interfaces';
import { mongoConnection } from './mongoconnection';
import { apiDef, privateKey } from '../app';
import { BadRequestError, request } from '@tb/service-utils';
import { environment } from '@tb/environment/dist/service';

export async function UpdateUser(userId: string, updatedProfile: IUserProfile): Promise<void> {
    checkUserProfile(updatedProfile);
    return mongoConnection(apiDef.name, async db => {
        const userCollection = db.collection('user');
        const oldUser = await userCollection.find<IUserProfile>({ id: userId }).next();
        await userCollection.updateOne({ id: userId }, {
            $set: <Partial<IUserProfile>>{
                email: updatedProfile.email,
                firstName: updatedProfile.firstName,
                lastName: updatedProfile.lastName,
                picturePath: updatedProfile.picturePath,
                nickName: updatedProfile.nickName,
            }
        });
        if (updatedProfile.nickName !== oldUser?.nickName) {
            await request(
                {
                    from: apiDef,
                    to: environment.api.auth,
                    method: 'patch',
                    route: '/update-login',
                    body: {
                        userId,
                        login: updatedProfile.nickName,
                    },
                },
                privateKey,
            ).catch(async err => {
                await userCollection.updateOne({ id: userId }, { $set: oldUser });
                throw err;
            });
        }
    });
}

export function checkUserProfile(userProfile: IUserProfile): void {
    //TODO
}

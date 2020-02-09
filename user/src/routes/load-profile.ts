import { IUserProfile } from '@tb/interfaces';
import { mongoConnection } from './mongoconnection';
import { apiDef } from '../app';
import { BadRequestError, NotFoundError } from '@tb/service-utils';

export async function LoadProfile(id: string | undefined, logedInUserId: string): Promise<IUserProfile> {
    if (!id) throw new BadRequestError();
    return mongoConnection(apiDef.name, async db => {
        const userProfile: IUserProfile | null = await db.collection('user').find<IUserProfile>({ id }).next();
        if (!userProfile) throw new NotFoundError();
        userProfile.isMe = id === logedInUserId;
        // Todo: Determine if user is my friend
        return userProfile;
    });
}

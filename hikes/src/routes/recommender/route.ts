import { Router } from 'express';
import { apiDef, privateKey } from '../../app';
import { environment } from '@tb/environment/dist/service';
import { request } from '@tb/service-utils';
import { IRecommendedHikes } from '@tb/interfaces';

const router = Router();

router.get('/', (req, res) => {
    const loggedInUserId = (req as any).authorizationToken.userId;
    if (isNaN(loggedInUserId)) {
        res.status(400).send('UserId: ' + loggedInUserId + ' is not a number.');
    }
    getRecommendedHikes(loggedInUserId).then(recommendedHike => {
        res.status(200).send(recommendedHike);
    }).catch(err => {
        console.error(err);
        console.log('Using default values for recommended Hikes...');
        res.status(200).send([1373043,1404100]);
    });

});

async function getRecommendedHikes(userId: number): Promise<IRecommendedHikes> {
    return request<IRecommendedHikes>(
        {
            method: 'get',
            from: apiDef,
            to: environment.api.recommender,
            route: '/',
            body: {
                userId: userId
            }
        },
        privateKey,
    );
}

export default router;

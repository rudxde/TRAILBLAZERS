import { Router } from 'express';
import register from './register/route';
import friends from './friends/route';
import search from './search/route';
import { LoadProfile } from './load-profile';
import { VerifyLoginMiddleware } from '@tb/service-utils';
import { environment } from '@tb/environment/dist/service';
import { publicKeys } from '../app';
import { IUserProfile, IServiceErrors, IHikingRoute, IHikeReport } from '@tb/interfaces';
import { UpdateUser } from './update-profile';
import { SubmitReport } from './submit-report';
const router = Router();

router.use('/register', register);

router.use(VerifyLoginMiddleware(environment.api.auth, publicKeys));

router.use('/friends', friends);
router.use('/search', search);

router.post('/submit-report', async (req, res) => {
    const loggedInUserId = (req as any).authorizationToken.userId;
    const report: IHikeReport = req.body;
    return SubmitReport(loggedInUserId, report)
        .then(() => res.sendStatus(200))
        .catch((err: IServiceErrors) => {
            if (err.isServiceError) {
                return res.sendStatus(err.statusCode);
            }
            console.error(err);
            return res.sendStatus(500);
        });
});

router.patch('/me', async (req, res) => {
    const loggedInUserId = (req as any).authorizationToken.userId;
    const updatedUserProfile: IUserProfile = req.body;
    return UpdateUser(loggedInUserId, updatedUserProfile)
        .then(() => res.send({}))
        .catch((err: IServiceErrors) => {
            if (err.isServiceError) {
                return res.sendStatus(err.statusCode);
            }
            console.error(err);
            return res.sendStatus(500);
        });
});

router.get('/:id', async (req, res) => {
    const logedInUserId = (req as any).authorizationToken.userId;
    let id = req.params.id;
    if (id === 'me') {
        id = logedInUserId;
    }
    return LoadProfile(id, logedInUserId)
        .then(x => res.send(x))
        .catch((err: IServiceErrors) => {
            if (err.isServiceError) return res.sendStatus(err.statusCode);
            console.error(err);
            return res.sendStatus(500);
        });
});

export default router;

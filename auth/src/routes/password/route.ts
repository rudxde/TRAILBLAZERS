import { Router } from 'express';
import { VerifyLoginMiddleware } from '@tb/service-utils';
import { publicKeys } from '../../app';
import { ChangePassword } from './change-password';
import { environment } from '@tb/environment/dist/service';
import { Auth, IServiceErrors } from '@tb/interfaces';

const router = Router();

router.use(VerifyLoginMiddleware(environment.api.auth, publicKeys));

router.patch('/', async (req, res) => {
    const userId = (req as any).authorizationToken.userId;
    const changePwRequest: Auth.IChangePasswordRequest = req.body;
    return ChangePassword(userId, changePwRequest.oldPassword, changePwRequest.newPassword)
        .then(() => res.send({}))
        .catch((err: IServiceErrors) => {
            if (err.isServiceError) return res.sendStatus(err.statusCode);
            console.log(err);
            return res.sendStatus(500);
        });
});

export default router;

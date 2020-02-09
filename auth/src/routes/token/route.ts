import { Router } from 'express';
import { RefreshToken } from './token';
import { VerifyToken } from '@tb/service-utils';
import { apiDef, publicKeys } from '../../app';
import { IServiceErrors } from '@tb/interfaces';

const router = Router();

router.get('/verify', (req, res) => {
    const authToken = req.headers['authorization'];
    return VerifyToken(authToken, apiDef, publicKeys)
        .then(verifyed => verifyed ? res.sendStatus(200) : res.sendStatus(401))
        .catch((err: IServiceErrors) => {
            if (err.isServiceError) return res.sendStatus(err.statusCode);
            console.error(err);
            return res.sendStatus(500);
        });
});

router.get('/refresh', (req, res) => {
    const authToken = req.headers['authorization'];
    return RefreshToken(authToken)
        .then(token => res.send(token))
        .catch((err: IServiceErrors) => {
            if (err.isServiceError) return res.sendStatus(err.statusCode);
            console.error(err);
            return res.sendStatus(500);
        });
});

export default router;

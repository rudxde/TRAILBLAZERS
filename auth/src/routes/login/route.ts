import { Router } from 'express';
import { Login } from './login';
import { IServiceErrors } from '@tb/interfaces';

const router = Router();
router.put('/', (req, res) => {
    const { login, password } = req.body;
    return Login(login, password)
        .then(token => res.send(token))
        .catch((err: IServiceErrors) => {
            if (err.isServiceError) return res.sendStatus(err.statusCode);
            console.error(err);
            return res.sendStatus(500);
        });
});
export default router;

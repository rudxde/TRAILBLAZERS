import { Router } from 'express';
import { VerifyLoginMiddleware } from '@tb/service-utils';
import { publicKeys } from './app';
import { environment } from '@tb/environment/dist/service';
import routes from './routes/route';

const router = Router();

router.use(VerifyLoginMiddleware(environment.api.auth, publicKeys));

router.get('/', (req, res) => {
    return res.send('hikes - works');
});

router.use(routes);

export default router;

import { Router } from 'express';
import { apiDef } from './app';
import routes from './routes/route';

const router = Router();
router.get('/', async (req, res) => {
    return res.send(`${apiDef.name} - works`);
});

router.use(routes);
export default router;

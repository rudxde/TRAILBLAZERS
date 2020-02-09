import { Router } from 'express';
import chunkRoute from './routes/chunk/route';

const router = Router();
router.get('/', (req, res) => {
    return res.send('map - works');
});

router.use('/chunk', chunkRoute);

export default router;

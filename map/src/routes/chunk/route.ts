import { Router } from 'express';
import { BadRequestError } from '@tb/service-utils';
import { LoadChunk } from './load-chunk';
import { IServiceErrors } from '@tb/interfaces';

const router = Router();
router.get('/:chunkid', (req, res) => {
    const chunkId: string | undefined = req.params.chunkid;
    LoadChunk(chunkId)
        .then(x => res.send(x))
        .catch((err: IServiceErrors) => {
            if (err.isServiceError) return res.sendStatus(err.statusCode);
            console.error(err);
            return res.sendStatus(500);
        });
});
router.put('/', (req, res) => {
    const chunkIds: string[] | undefined = req.body.chunks;
    if(!chunkIds) throw new BadRequestError();
    Promise.all(chunkIds.map(x => LoadChunk(x)))
        .then(x => res.send(x))
        .catch((err: IServiceErrors) => {
            if (err.isServiceError) return res.sendStatus(err.statusCode);
            console.error(err);
            return res.sendStatus(500);
        });
});

export default router;

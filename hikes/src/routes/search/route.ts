import { Router } from 'express';
import { IHikingRouteSearchQuery, IServiceErrors } from '@tb/interfaces';
import { searchDB } from './searchHikes';

const router = Router();

router.put('/', (req, res) => {
    const searchObject: Partial<IHikingRouteSearchQuery> = req.body;
    searchDB(searchObject).then((results: number[]) => {
        res.status(200).send(results);
    }).catch((err: IServiceErrors) => {
        if (err.isServiceError) {
            return res.sendStatus(err.statusCode);
        }
        console.error(err);
        return res.sendStatus(500);
    });
});

export default router;

import { Router } from 'express';
import { findHikeByIdAPI, findHikesDb } from './search/findHike';
import { IServiceErrors } from '@tb/interfaces';
import recommender from './recommender/route';
import search from './search/route';

const router = Router();

router.use('/recommender', recommender);

router.use('/search', search);

/**
 * (Trys to find the Hike by ID in the local DB or 
 * Passes the request to the OutdoorActive API) and returns it to the client 
 * Also adds the constructed img URL to the response
 *
 * @param {id} hikeId unique hikeId 
 * @returns the hike as def. in frontend or an ServerError or an ClientError if the id sent is not a number
 */
router.get('/:id', async (req, res) => {
    // checks if id is a number
    if (isNaN(parseInt(req.params.id))) {
        res.status(400).send('HikeId: ' + req.params.id + ' is not a number.');
    }
    let hikeId = req.params.id;

    // constructing the URL for the preview image
    let imgUrl = 'http://img.oastatic.com/img/';

    // trying to find the requested Hike by id in the DB or the OutdoorActive API if its not found locally
    findHikesDb({id: hikeId},{},false).then(hikeDB => {
        imgUrl = imgUrl + hikeDB.primaryImage.id + '/.jpg';
        hikeDB.constructedImgUrl = imgUrl;
        res.status(200).send(hikeDB);
    }).catch((err: IServiceErrors) => {
        // hike was not found localy  
        if (err.isServiceError) {
            findHikeByIdAPI(hikeId).then(hikeAPI => {
                imgUrl = imgUrl + hikeAPI.primaryImage.id + '/.jpg';
                hikeAPI.constructedImgUrl = imgUrl;
                res.status(200).send(hikeAPI);
                // hike was also not found in the outdooractive API -> send fallback data    
            }).catch(err => {
                res.sendStatus(404);
            });
            // general server error
        } else {
            console.error(err);
            res.status(500).send(err);
        }
    });
});

export default router;

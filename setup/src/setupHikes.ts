import { Db } from 'mongodb';
import { IApiDef } from '@tb/interfaces';
import { zip } from 'compressing';
import { promises as fsPromises, existsSync } from 'fs';

const tourZipDIR = '/usr/src/app/template/';
const tourZipFilePath = tourZipDIR + 'tours.zip';
const unzipPath = '/usr/src/app/unzipped/';

/**
 *  Setup script for the hikes service. Extract the hike Json Zip File from the given Path 
 *  and inserts them into the DB
 *
 * @export
 * @param {Db} db
 * @param {IApiDef} service
 * @returns {Promise<void>}
 */
export async function setupHikes(db: Db, service: IApiDef): Promise<void> {
    try {
        if (!existsSync(unzipPath)) {
            await fsPromises.mkdir(unzipPath);
        }
        await zip.uncompress(tourZipFilePath, unzipPath);
        let hikesFiles = await fsPromises.readdir(unzipPath);
        await db.createCollection('hikingroutes');
        for (const hikeFile of hikesFiles) {
            // encoding is explicity set so that the return promise is a string, see fs doc
            let hikeContent = JSON.parse((await fsPromises.readFile(unzipPath + hikeFile, 'UTF8')).toString());

            // only inserting if its not existing already
            const collection = await db.collection('hikingroutes');
            if (await collection.find(hikeContent).next() == null) {
                await collection.insertOne(hikeContent);
            }
        }
        console.log('Hike setup done');
    } catch (error) {
        console.error(error);
    }
}

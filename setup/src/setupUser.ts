import { Db } from 'mongodb';
import { IApiDef, IUserProfile } from '@tb/interfaces';
/**
 *  Setup script for the user service.
 *
 * @export
 * @param {Db} db
 * @param {IApiDef} service
 * @returns {Promise<void>}
 */
export async function setupUser(db: Db, service: IApiDef): Promise<void> {
    await db.createCollection('user');
    await db.collection('user').insertMany(<IUserProfile[]>[
        {
            'id': '0',
            'firstName': 'Peter',
            'lastName': 'Griffin',
            'nickName': 'Peter',
            'personalScores': {},
            'picturePath': '/assets/profile_pic.png',
            'rank': 5
        },
        {
            'id': '1',
            'firstName': 'Stuart',
            'lastName': 'Griffin',
            'nickName': 'Stui',
            'personalScores': {},
            'picturePath': 'https://tvguide1.cbsistatic.com/i/2018/03/15/af173df7-4d4c-4557-bdd8-ad0f3e34b221/180314-familyguy.jpg',
            'rank': 0
        },
        {
            'id': '2',
            'firstName': 'Lois',
            'lastName': 'Griffin',
            'nickName': 'Lois',
            'personalScores': {},
            'picturePath': 'http://www.coverwhiz.com/content/Family-Guy-Season-15.jpg',
            'rank': 3
        },
        {
            'id': '3',
            'firstName': 'Mag',
            'lastName': 'Griffin',
            'nickName': 'Mag',
            'personalScores': {},
            'picturePath': 'https://i0.wp.com/www.drawcentral.com/wp-content/uploads/2015/06/meg-griffin-family-guy-feature.jpg?fit=1080,696',
            'rank': 0
        }
    ]);

    await db.createCollection('friends');
    // await db.collection('user').insertMany([

    // ]);
}

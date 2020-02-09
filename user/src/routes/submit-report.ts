import { IHikeReport } from '@tb/interfaces';
import { mongoConnection } from './mongoconnection';
import { apiDef } from '../app';

export function SubmitReport(userId: IHikeReport, report: IHikeReport): Promise<void> {
    return mongoConnection(apiDef.name, async db => {
        await db.collection('hike-reports').insertOne({
            userId,
            report,
        });
    });
}

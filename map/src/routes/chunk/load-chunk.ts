import { Maps } from '@tb/interfaces';
import { mongoConnection } from '../../mongoconnection';
import { apiDef } from '../../app';
import { Db } from 'mongodb';
import { BadRequestError } from '@tb/service-utils';

/**
 * Loads the chunk with the requested id from the database.
 *
 * @export
 * @param {string} chunkId
 * @returns {Promise<Maps.IChunk>}
 */
export async function LoadChunk(chunkId: string): Promise<Maps.IChunk> {
    if (!chunkId) throw new BadRequestError();
    return mongoConnection(apiDef.name,db => {
        return Promise.all([
            LoadNodes(chunkId, db),
            LoadWays(chunkId, db),
        ]).then(([nodes, ways]) => (<Maps.IChunk>{
            id: chunkId,
            nodes: nodes.map(clearOsmNodes),
            ways: ways.map(clearOsmWay),
        }));
    });
}

function clearOsmNodes(x: Maps.IOsmNode): Maps.IOsmNode {
    return {
        chunk: x.chunk,
        id: x.id,
        lat: x.lat,
        lon: x.lon,
    };
}

function clearOsmWay(x: Maps.IOsmWay): Maps.IOsmWay {
    return {
        chunks: x.chunks,
        id: x.id,
        nodes: x.nodes,
        level: x.level || undefined,
        name: x.name || undefined,
        highway: x.highway || undefined,
        access: x.access || undefined,
        description: x.description || undefined,
        surface: x.surface || undefined,
        tracktype: x.tracktype || undefined,
        building: x.building || undefined,
        amenity: x.amenity || undefined,
        man_made: x.man_made || undefined,
        waterway: x.waterway || undefined,
        foot: x.foot || undefined,
        layer: x.layer || undefined,
        tunnel: x.tunnel || undefined,
    };
}

async function LoadNodes(chunkId: string, db: Db): Promise<Maps.IOsmNode[]> {
    return db.collection('nodes').find({
        chunk: chunkId
    }).toArray();
}

async function LoadWays(chunkId: string, db: Db): Promise<Maps.IOsmWay[]> {
    return db.collection('ways').find({
        chunks: chunkId
    }).toArray();
}

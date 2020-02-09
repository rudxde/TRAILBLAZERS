import { getChunk, getChunkBaseCoords } from './chunk';

fdescribe('chunk id convert', () => {
    it('should get coords for chunk', () => {
        const chunkId = getChunk({ lat: 48.1234, lon: 12.1234 });
        expect(chunkId).toEqual('4812312123');
    });
    it('should get base from chunk from id', () => {
        const coords = getChunkBaseCoords({ id: '4812312123', nodes: [], ways: [] });
        expect(coords.lat).toBe(48.123);
        expect(coords.lon).toBe(12.123);
    });
});

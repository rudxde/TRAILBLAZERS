import { roundIPoint, coordsToPixel } from '../coord-pixel';
import { Maps } from '@tb/interfaces';
import { IExtendedChunk } from 'src/app/reducers/map.reducer';

/**
 * Creates an path connecting all coordinates from the given way.
 *
 * @export
 * @param {CanvasRenderingContext2D} ctx
 * @param {Maps.ICoords} base
 * @param {Maps.IOsmWay} way
 * @param {IExtendedChunk} chunk
 * @param {Maps.IPoint} offset
 * @param {number} scale
 * @returns {void}
 */
export function followPath(
    ctx: CanvasRenderingContext2D,
    base: Maps.ICoords,
    way: Maps.IOsmWay,
    chunk: IExtendedChunk,
    offset: Maps.IPoint,
    scale: number,
): void {
    const nodes = way.nodes.map(nodeId => chunk.nodeMap.get(nodeId));
    let i = 0;
    // Skip nodes, which are not in the loaded data
    while (!nodes[i]) {
        i++;
        if (nodes.length === i - 1) return;
    }

    ctx.beginPath();
    const firstPoint = roundIPoint(coordsToPixel(base, nodes[i], offset, scale));
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (; i < nodes.length; i++) {
        if (!nodes[i]) { // Skip nodes, which are not in the loaded data
            while (!nodes[i]) {
                i++;
                if (nodes.length === i - 1) return;
            }
            const point = roundIPoint(coordsToPixel(base, nodes[i], offset, scale));
            ctx.moveTo(point.x, point.y); // begin a new path
        } else {
            const point = roundIPoint(coordsToPixel(base, nodes[i], offset, scale));
            ctx.lineTo(point.x, point.y);
        }
    }
}

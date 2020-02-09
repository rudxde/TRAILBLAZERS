import { IExtendedChunk } from 'src/app/reducers/map.reducer';
import { Maps } from '@tb/interfaces';
import { followPath } from './follow-path';

/**
 * Draws all ways from the chunk on a canvas.
 *
 * @export
 * @param {CanvasRenderingContext2D} ctx Render-context of the canvas to draw on.
 * @param {IExtendedChunk} chunk The map data to Draw
 * @param {Maps.ICoords} base The base coordinates of the view.
 * @param {Maps.IPoint} offset An pixel offset for the rendered base.
 * @param {number} scale The scale of the map.
 */
export function renderMap(ctx: CanvasRenderingContext2D, chunk: IExtendedChunk, base: Maps.ICoords, offset: Maps.IPoint, scale: number): void {
    chunk.ways.forEach(way => {
        drawWay(ctx, base, way, chunk, offset, scale);
    });
}

/**
 * Draws an way.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Maps.ICoords} base
 * @param {Maps.IOsmWay} way
 * @param {IExtendedChunk} chunk
 * @param {Maps.IPoint} offset
 * @param {number} scale
 */
function drawWay(ctx: CanvasRenderingContext2D, base: Maps.ICoords, way: Maps.IOsmWay, chunk: IExtendedChunk, offset: Maps.IPoint, scale: number): void {
    if (way.highway) {
        drawHighway(ctx, base, way, chunk, offset, scale);
    } else if (way.building) {
        followPath(ctx, base, way, chunk, offset, scale);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#B1B0B0';
        ctx.stroke();
        ctx.fillStyle = '#E3E1E1';
        ctx.fill();
    } else if (way.waterway) {
        followPath(ctx, base, way, chunk, offset, scale);
        if (way.nodes[0] === way.nodes[way.nodes.length - 1]) {
            ctx.fillStyle = '#0B5DB2';
            ctx.fill();
        } else {
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#0B5DB2';
            ctx.stroke();
        }
    } else if (way.tunnel) {
        ctx.setLineDash([1, 1]);
        followPath(ctx, base, way, chunk, offset, scale);
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'c3c1c0';
        ctx.stroke();
        ctx.setLineDash([1]);
        followPath(ctx, base, way, chunk, offset, scale);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'dddde9';
        ctx.stroke();
    } else if (way.man_made) {
        //TODO
    }
}

// https://wiki.openstreetmap.org/wiki/Key:highway
function drawHighway(ctx: CanvasRenderingContext2D, base: Maps.ICoords, way: Maps.IOsmWay, chunk: IExtendedChunk, offset: Maps.IPoint, scale: number): void {
    switch (way.highway) {
        case 'motorway':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 6, '#e990a0', '#e35882');
            break;
        case 'trunk':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 6, '#fbb29a', '#d88064');
            break;
        case 'primary':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 4, 'fdd7a1', '#cfa348');
            break;
        case 'secondary':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 4, '#f6fabb', '#afb94f');
            break;
        case 'tertiary':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 4, '#ffffff', '#bfbfbd');
            break;
        case 'unclassified':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 3, '#ffffff', '#bfbfbd');
            break;
        case 'residential':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 3, '#ffffff', '#bfbfbd');
            break;
        case 'motorway_link':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 3, '#e990a0', '#e35882');
            break;
        case 'trunk_link':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 3, '#fbb29a', '#d88064');
            break;
        case 'primary_link':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 3, 'fdd7a1', '#cfa348');
            break;
        case 'secondary_link':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 3, '#f6fabb', '#afb94f');
            break;
        case 'tertiary_link':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 3, '#ffffff', '#bfbfbd');
            break;
        case 'living_street':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 3, '#ededed', '#d2d1cf');
            break;
        case 'service':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 3, '#ffffff', '#e6e4e4');
            break;
        case 'pedestrian':
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 3, '#dddde9', '#c3c1c0');
            break;
        case 'track':
            dashWay(ctx, base, offset, scale, way, chunk, 1, [4, 1, 2, 1], '#b69343');
            break;
        case 'bus_guideway':
            dashWay(ctx, base, offset, scale, way, chunk, 1, [5, 5], '#6969ff');
            break;
        case 'footway':
            dashWay(ctx, base, offset, scale, way, chunk, 1, [2, 1], '#f8aba2');
            break;
        case 'bridleway':
            dashWay(ctx, base, offset, scale, way, chunk, 1, [3, 1], '#49a247');
            break;
        case 'steps':
            dashWay(ctx, base, offset, scale, way, chunk, 2, [1, 1], '#fc7f6f');
            break;
        case 'path':
            dashWay(ctx, base, offset, scale, way, chunk, 2, [1, 1], '#f99f94');
            break;
        case 'cycleway':
            dashWay(ctx, base, offset, scale, way, chunk, 2, [2, 1], '#7877f8');
            break;
        case 'construction':
            dashWay(ctx, base, offset, scale, way, chunk, 3, [3, 3], '#88a3cc');
            break;
        default:
            drawWayWithBorder(ctx, base, offset, scale, way, chunk, 3, '#dddde9', '#c3c1c0');
            break;
    }
}

/**
 * Draws way two times, to simulate a border an the way.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Maps.ICoords} base
 * @param {Maps.IPoint} offset
 * @param {number} scale
 * @param {Maps.IOsmWay} way
 * @param {IExtendedChunk} chunk
 * @param {number} width Width of the way. 
 * @param {string} primaryColor Color of the way
 * @param {string} secondaryColor Color of the border
 */
function drawWayWithBorder(
    ctx: CanvasRenderingContext2D,
    base: Maps.ICoords,
    offset: Maps.IPoint,
    scale: number,
    way: Maps.IOsmWay,
    chunk: IExtendedChunk,
    width: number,
    primaryColor: string,
    secondaryColor: string,
): void {
    ctx.setLineDash([1]);
    followPath(ctx, base, way, chunk, offset, scale);
    ctx.lineWidth = width + 2;
    ctx.strokeStyle = secondaryColor;
    ctx.stroke();
    followPath(ctx, base, way, chunk, offset, scale);
    ctx.lineWidth = width;
    ctx.strokeStyle = primaryColor;
    ctx.stroke();
}

function dashWay(
    ctx: CanvasRenderingContext2D,
    base: Maps.ICoords,
    offset: Maps.IPoint,
    scale: number,
    way: Maps.IOsmWay,
    chunk: IExtendedChunk,
    width: number,
    pattern: number[],
    color: string,
): void {
    ctx.setLineDash(pattern);
    followPath(ctx, base, way, chunk, offset, scale);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
}

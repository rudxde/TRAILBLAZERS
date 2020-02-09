import { Maps } from '@tb/interfaces';

export function roundIPoint(point: Maps.IPoint): Maps.IPoint {
    return {
        x: Math.round(point.x),
        y: Math.round(point.y),
    };
}

export function coordsToPixel(base: Maps.ICoords, position: Maps.ICoords, offset: Maps.IPoint, scale: number): Maps.IPoint {
    const x = Math.floor((position.lon - base.lon) * scale);
    const y = Math.floor((position.lat - base.lat) * -scale);
    return {
        x: x + offset.x,
        y: y + offset.y,
    };
}

export function pixelToCoords(base: Maps.ICoords, position: Maps.IPoint, offset: Maps.IPoint, scale: number): Maps.ICoords {
    const x = position.x - offset.x;
    const y = position.y - offset.y;
    const lon = (x / scale) + base.lon;
    const lat = (y / -scale) + base.lat;
    return { lon, lat };
}

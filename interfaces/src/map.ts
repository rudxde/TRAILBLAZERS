export namespace Maps {

    /**
     * Represents an Node of an OsmWay
     *
     * @export
     * @interface IOsmNode
     * @extends {ICoords}
     */
    export interface IOsmNode extends ICoords {
        /**
         * An chunk is an field of coordinates to separate the map into pieces to make the indexing in the database easy.
         * 
         * The chunk are thr coordinates as a fixed-point number with 3 digits after the comma, concatenated from long and lat.
         *
         * @type {string}
         * @memberof IOsmNode
         */
        chunk: string;
        /**
         * The Id of the Node
         *
         * @type {string}
         * @memberof IOsmNode
         */
        id: string;
    }

    /**
     * Represents an path, which could be an way, building river or anything on the map
     *
     * @export
     * @interface IOsmWay
     */
    export interface IOsmWay {
        /**
         * The ids of the nodes of which the way consists.
         *
         * @see {@link IOsmNode}
         * @type {string[]}
         * @memberof IOsmWay
         */
        nodes: string[];
        /**
         * All chunks from which the nodes are inside.
         *
         * @type {string[]}
         * @memberof IOsmWay
         */
        chunks: string[];
        /**
         * The id of the way
         *
         * @type {string}
         * @memberof IOsmWay
         */
        id: string;
        /**
         * See: https://wiki.openstreetmap.org/wiki/Key:level
         *
         * @type {string}
         * @memberof IOsmWay
         */
        level?: string;
        /**
         * Name of the represented object.
         *  
         * See: https://wiki.openstreetmap.org/wiki/Key:name
         *
         * @type {string}
         * @memberof IOsmWay
         */
        name?: string;
        /**
         * Is defined if the OsmWay is a street, a way or etc.
         * 
         * See: https://wiki.openstreetmap.org/wiki/Key:highway
         *
         * @type {string}
         * @memberof IOsmWay
         */
        highway?: string;
        /**
         * See: https://wiki.openstreetmap.org/wiki/Key:access
         *
         * @type {string}
         * @memberof IOsmWay
         */
        access?: string;
        /**
         * An description of the object.
         * 
         * See: https://wiki.openstreetmap.org/wiki/Key:description
         *
         * @type {string}
         * @memberof IOsmWay
         */
        description?: string;
        /**
         * See: https://wiki.openstreetmap.org/wiki/Key:surface
         *
         * @type {string}
         * @memberof IOsmWay
         */
        surface?: string;
        /**
         * See: https://wiki.openstreetmap.org/wiki/Key:tracktype
         *
         * @type {string}
         * @memberof IOsmWay
         */
        tracktype?: string;
        /**
         * Is set if the osmWay represents an building
         * 
         * See: https://wiki.openstreetmap.org/wiki/Key:building
         *
         * @type {string}
         * @memberof IOsmWay
         */
        building?: string;
        /**
         * See: https://wiki.openstreetmap.org/wiki/Key:amenity
         *
         * @type {string}
         * @memberof IOsmWay
         */
        amenity?: string;
        /**
         * See: https://wiki.openstreetmap.org/wiki/Key:man_made
         *
         * @type {string}
         * @memberof IOsmWay
         */
        man_made?: string;
        /**
         * See: https://wiki.openstreetmap.org/wiki/Key:waterway
         *
         * @type {string}
         * @memberof IOsmWay
         */
        waterway?: string;
        /**
         * See: https://wiki.openstreetmap.org/wiki/Key:foot
         *
         * @type {string}
         * @memberof IOsmWay
         */
        foot?: string;
        /**
         * See: https://wiki.openstreetmap.org/wiki/Key:layer
         *
         * @type {string}
         * @memberof IOsmWay
         */
        layer?: string;
        /**
         * See: https://wiki.openstreetmap.org/wiki/Key:tunnel
         *
         * @type {string}
         * @memberof IOsmWay
         */
        tunnel?: string;
    }

    /**
     * All Ways and nodes contained in a chunk
     *
     * @export
     * @interface IChunk
     */
    export interface IChunk {
        id: string;
        ways: IOsmWay[];
        nodes: IOsmNode[];
    }

    /**
     * Represents coordinates.
     *
     * @export
     * @interface ICoords
     */
    export interface ICoords {
        lon: number;
        lat: number;
    }

    /**
     * Represents an Point on the screen.
     *
     * @export
     * @interface IPoint
     */
    export interface IPoint {
        x: number;
        y: number;
    }

    export interface IViewport {
        height: number;
        width: number;
        scale: number;
        preRenderBorderWidth: number;
    }

    export type ISpeedDataState = 'initial' | 'pause' | 'walking' | 'running' | 'slow' | 'driving';

    export interface ISpeedData {
        groupId: string;
        timestamp: Date;
        state: ISpeedDataState;
        speed: number;
        position: ICoords;
    }

}

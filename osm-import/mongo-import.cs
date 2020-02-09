using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace osm_import
{
    public class MongoImport
    {
        NodeService nodeService;
        WayService wayService;
        public MongoImport()
        {
            this.nodeService = new NodeService(
                new IDatabaseSettings()
                {
                    CollectionName = "nodes",
                    // ConnectionString = "mongodb://mongo-map:27017/",
                    ConnectionString = "mongodb://localhost:27005/",
                    DatabaseName = "map",
                }
            );
            this.wayService = new WayService(
                new IDatabaseSettings()
                {
                    CollectionName = "ways",
                    // ConnectionString = "mongodb://mongo-map:27017/",
                    ConnectionString = "mongodb://localhost:27005/",
                    DatabaseName = "map",
                }
            );
        }


        private string getChunk(double lat, double lon)
        {
            System.Globalization.CultureInfo invariantCulture = System.Globalization.CultureInfo.InvariantCulture;
            string shortLat = (lat * Math.Pow(10, 3)).ToString("F0", invariantCulture);
            string shortLon = (lon * Math.Pow(10, 3)).ToString("F0", invariantCulture);
            shortLat = shortLat.PadLeft(5, '0');
            shortLon = shortLon.PadLeft(5, '0');
            return shortLat + shortLon;
        }

        public void insertNode(string osmId, double lat, double lon, string verion)
        {
            Program.logProcess("node:" + osmId);
            nodeService.Create(
               new osm_import.Map.Node()
               {
                   Chunk = getChunk(lat, lon),
                   Lat = lat,
                   Lon = lon,
                   OsmId = osmId,
                   Version = verion,
               }
           );
        }

        public void insertWay(string osmId, string[] nodes, string version, Dictionary<string, string> tags)
        {
            Program.logProcess("way:" + osmId);
            List<string> chunks = new List<string>();
            foreach (var nodeOsmId in nodes)
            {
                var node = nodeService.Get(nodeOsmId);
                if (!chunks.Exists(x => x.Equals(node.Chunk)))
                {
                    chunks.Add(node.Chunk);
                }
            }

            string level = null,
            name = null,
            highway = null,
            access = null,
            description = null,
            surface = null,
            tracktype = null,
            building = null,
            amenity = null,
            man_made = null,
            waterway = null,
            foot = null,
            layer = null,
            tunnel = null;

            foreach (KeyValuePair<string, string> tag in tags)
            {
                // do something with entry.Value or entry.Key
                switch (tag.Key)
                {
                    case "level":
                        level = tag.Value;
                        break;
                    case "name":
                        name = tag.Value;
                        break;
                    case "highway":
                        highway = tag.Value;
                        break;
                    case "access":
                        access = tag.Value;
                        break;
                    case "description":
                        description = tag.Value;
                        break;
                    case "surface":
                        surface = tag.Value;
                        break;
                    case "tracktype":
                        tracktype = tag.Value;
                        break;
                    case "building":
                        building = tag.Value;
                        break;
                    case "amenity":
                        amenity = tag.Value;
                        break;
                    case "man_made":
                        man_made = tag.Value;
                        break;
                    case "waterway":
                        waterway = tag.Value;
                        break;
                    case "foot":
                        foot = tag.Value;
                        break;
                    case "layer":
                        layer = tag.Value;
                        break;
                    case "tunnel":
                        tunnel = tag.Value;
                        break;
                }
            }
            wayService.Create(
                new osm_import.Map.Way()
                {
                    OsmId = osmId,
                    Chunks = chunks.ToArray(),
                    Nodes = nodes,
                    Version = version,
                    Level = level,
                    Name = name,
                    Highway = highway,
                    Access = access,
                    Description = description,
                    Surface = surface,
                    Tracktype = tracktype,
                    Building = building,
                    Amenity = amenity,
                    Man_made = man_made,
                    Waterway = waterway,
                    Foot = foot,
                    Layer = layer,
                    Tunnel = tunnel
                }
            );
        }

        public async Task CreateNodeIndex()
        {
            Program.logProcess("Crete Node Index");
            await nodeService.CreateIndex();
        }
        public async Task CreateWayIndex()
        {
            Program.logProcess("Crete Way Index");
            await wayService.CreateIndex();
        }
    }
}

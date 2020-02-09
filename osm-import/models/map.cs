using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace osm_import.Map
{
    public class Node
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonElement("lat")]
        public double Lat { get; set; }
        [BsonElement("lon")]
        public double Lon { get; set; }
        [BsonElement("chunk")]
        public string Chunk { get; set; }
        [BsonElement("id")]
        public string OsmId { get; set; }
        [BsonElement("version")]
        public string Version { get; set; }
    }
    public class Way
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonElement("chunks")]
        public string[] Chunks { get; set; }
        [BsonElement("nodes")]
        public string[] Nodes { get; set; }
        [BsonElement("id")]
        public string OsmId { get; set; }
        [BsonElement("version")]
        public string Version { get; set; }
        [BsonElement("room")]
        public string Room { get; set; }
        [BsonElement("level")]
        public string Level { get; set; }
        [BsonElement("name")]
        public string Name { get; set; }
        [BsonElement("highway")]
        public string Highway { get; set; }
        [BsonElement("access")]
        public string Access { get; set; }
        [BsonElement("description")]
        public string Description { get; set; }
        [BsonElement("surface")]
        public string Surface { get; set; }
        [BsonElement("tracktype")]
        public string Tracktype { get; set; }
        [BsonElement("building")]
        public string Building { get; set; }
        [BsonElement("amenity")]
        public string Amenity { get; set; }
        [BsonElement("man_made")]
        public string Man_made { get; set; }
        [BsonElement("waterway")]
        public string Waterway { get; set; }
        [BsonElement("foot")]
        public string Foot { get; set; }
        [BsonElement("layer")]
        public string Layer { get; set; }
        [BsonElement("tunnel")]
        public string Tunnel { get; set; }
    }
}
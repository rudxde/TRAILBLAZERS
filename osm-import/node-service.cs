using osm_import.Map;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace osm_import
{
    // from https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-mongo-app?view=aspnetcore-3.1&tabs=visual-studio#create-the-aspnet-core-web-api-project
    public class NodeService
    {
        private readonly IMongoCollection<Node> _nodes;

        public NodeService(IDatabaseSettings databaseSettings)
        {
            var client = new MongoClient(databaseSettings.ConnectionString);
            var database = client.GetDatabase(databaseSettings.DatabaseName);
            _nodes = database.GetCollection<Node>(databaseSettings.CollectionName);
        }

        public List<Node> Get() =>
            _nodes.Find(node => true).ToList();

        public Node Get(string osmId) =>
            _nodes.Find<Node>(node => node.OsmId == osmId).FirstOrDefault();

        public Node Create(Node node)
        {
            Program.Elements++;
            _nodes.InsertOne(node);
            return node;
        }

        public async Task CreateIndex()
        {
            var chunkIndexModel = new CreateIndexModel<Node>(Builders<Node>.IndexKeys.Ascending(x => x.Chunk));
            var idIndexModel = new CreateIndexModel<Node>(Builders<Node>.IndexKeys.Ascending(x => x.OsmId));
            await _nodes.Indexes.CreateOneAsync(chunkIndexModel);
            await _nodes.Indexes.CreateOneAsync(idIndexModel);
        }

        public void InsertMany(Node[] nodes)
        {
            _nodes.InsertMany(nodes);
            Program.Elements += nodes.Length;
        }

        public void Update(string id, Node nodeIn) =>
            _nodes.ReplaceOne(node => node.Id == id, nodeIn);

        public void Remove(Node nodeIn) =>
            _nodes.DeleteOne(node => node.Id == nodeIn.Id);

        public void Remove(string id) =>
            _nodes.DeleteOne(node => node.Id == id);
    }
}

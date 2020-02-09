using osm_import.Map;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace osm_import
{
    // from https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-mongo-app?view=aspnetcore-3.1&tabs=visual-studio#create-the-aspnet-core-web-api-project
    public class WayService
    {
        private readonly IMongoCollection<Way> _ways;

        public WayService(IDatabaseSettings databaseSettings)
        {
            var client = new MongoClient(databaseSettings.ConnectionString);
            var database = client.GetDatabase(databaseSettings.DatabaseName);
            _ways = database.GetCollection<Way>(databaseSettings.CollectionName);
        }

        public List<Way> Get() =>
            _ways.Find(way => true).ToList();

        public Way Get(string osmId) =>
            _ways.Find<Way>(way => way.OsmId == osmId).FirstOrDefault();

        public Way Create(Way way)
        {
            _ways.InsertOne(way);
            Program.Elements++;
            return way;
        }
        public async Task CreateIndex()
        {
            var indexModel = new CreateIndexModel<Way>(Builders<Way>.IndexKeys.Ascending(x => x.Chunks));
            await _ways.Indexes.CreateOneAsync(indexModel);
        }

        public void Update(string id, Way wayIn) =>
            _ways.ReplaceOne(way => way.Id == id, wayIn);

        public void Remove(Way wayIn) =>
            _ways.DeleteOne(way => way.Id == wayIn.Id);

        public void Remove(string id) =>
            _ways.DeleteOne(way => way.Id == id);
    }
}

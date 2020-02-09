using System.IO;
using System.Threading.Tasks;

namespace osm_import
{
    class Program
    {
        public static bool skipNodes = false;
        static async Task Main(string[] args)
        {
            if (args.Length == 0)
            {
                System.Console.WriteLine("Path is missing!");
                return;
            }
            new MongoImport();
            string Path = args[0];
            Stream stream = File.OpenRead(Path);
            Task watchElements = CountElementsPerSecond();
            XmlImport xmlImport = new XmlImport();
            await xmlImport.ReadAndImport(stream);
            watchElementsPerSecond = false;
            System.Console.WriteLine("\nImported {0}", Path);
        }

        static string lastMessage = "";
        public static void logProcess(string message)
        {
            System.Console.SetCursorPosition(0, System.Console.CursorTop);
            System.Console.Write("{0} | {1} Entrys/Second", message.PadRight(lastMessage.Length), ElementsPerSecond);
        }

        public static int Elements = 0;
        private static int ElementsPerSecond = 0;
        private static bool watchElementsPerSecond = true;
        public static async Task CountElementsPerSecond()
        {
            while (watchElementsPerSecond)
            {
                ElementsPerSecond = Elements;
                Elements = 0;
                await Task.Delay(1000);
            }
        }
    }
}

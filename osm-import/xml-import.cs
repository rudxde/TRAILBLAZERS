using System;
using System.IO;
using System.Xml;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Globalization;

namespace osm_import
{
    public class XmlImport
    {
        MongoImport mongoImport;
        public XmlImport()
        {
            this.mongoImport = new MongoImport();
        }
        public async Task ReadAndImport(System.IO.Stream stream)
        {
            XmlReaderSettings settings = new XmlReaderSettings();
            settings.Async = true;
            using (XmlReader reader = XmlReader.Create(stream, settings))
            {
                await ReadNodeSection(reader);
                await this.mongoImport.CreateNodeIndex();
                await ReadWaySection(reader);
                await this.mongoImport.CreateWayIndex();
            }
        }

        private async Task ReadNodeSection(XmlReader reader)
        {
            while (await reader.ReadAsync())
            {
                switch (reader.NodeType)
                {
                    case XmlNodeType.Element:
                        switch (reader.Name)
                        {
                            case "node":
                                ReadNode(reader);
                                break;
                            case "way":
                                return;
                        }
                        break;
                }
            }
        }
        private async Task ReadWaySection(XmlReader reader)
        {
            do
            {
                switch (reader.NodeType)
                {
                    case XmlNodeType.Element:
                        switch (reader.Name)
                        {
                            case "way":
                                await ReadWay(reader);
                                break;
                        }
                        break;
                }
            } while (await reader.ReadAsync());
        }

        void ReadNode(XmlReader reader)
        {
            if (Program.skipNodes) return;
            string lat = null;
            string lon = null;
            string version = "";
            string osmId = null;
            int attributeCount = reader.AttributeCount;
            reader.MoveToFirstAttribute();
            for (int attrId = 0; attrId < attributeCount; attrId++)
            {
                switch (reader.Name)
                {
                    case "lat":
                        lat = reader.GetAttribute(attrId);
                        break;
                    case "lon":
                        lon = reader.GetAttribute(attrId);
                        break;
                    case "id":
                        osmId = reader.GetAttribute(attrId);
                        break;
                    case "version":
                        version = reader.GetAttribute(attrId);
                        break;
                }
                reader.MoveToNextAttribute();
            }
            reader.MoveToElement();
            this.mongoImport.insertNode(osmId, Double.Parse(lat, CultureInfo.InvariantCulture), Double.Parse(lon, CultureInfo.InvariantCulture), version);
        }
        async Task ReadWay(XmlReader reader)
        {
            string osmId = null;
            string version = null;
            List<string> nodes = new List<string>();
            Dictionary<string, string> tags = new Dictionary<string, string>();
            bool wayHasEnded = false;
            ReadWayAttributes(reader, ref osmId, ref version);
            while (await reader.ReadAsync() && !wayHasEnded)
            {
                switch (reader.NodeType)
                {
                    case XmlNodeType.Element:
                        switch (reader.Name)
                        {
                            case "nd":
                                ReadNdAttributes(reader, nodes);
                                break;
                            case "tag":
                                ReadTagAttributes(reader, tags);
                                break;
                        }
                        break;
                    case XmlNodeType.EndElement:
                        switch (reader.Name)
                        {
                            case "way":
                                wayHasEnded = true;
                                break;
                        }
                        break;
                }
            }
            mongoImport.insertWay(osmId, nodes.ToArray(), version, tags);
        }

        private static void ReadNdAttributes(XmlReader reader, List<string> nodes)
        {
            int attributeCount = reader.AttributeCount;
            reader.MoveToFirstAttribute();
            for (int attrId = 0; attrId < attributeCount; attrId++)
            {
                switch (reader.Name)
                {
                    case "ref":
                        nodes.Add(reader.GetAttribute(attrId));
                        break;

                }
                reader.MoveToNextAttribute();
            }
            reader.MoveToElement();
        }
        private static void ReadTagAttributes(XmlReader reader, Dictionary<string, string> tags)
        {
            int attributeCount = reader.AttributeCount;
            reader.MoveToFirstAttribute();
            string key = null;
            string value = null;
            for (int attrId = 0; attrId < attributeCount; attrId++)
            {
                switch (reader.Name)
                {
                    case "k":
                        key = reader.GetAttribute(attrId);
                        break;
                    case "v":
                        value = reader.GetAttribute(attrId);
                        break;

                }
                reader.MoveToNextAttribute();
            }
            if (!String.IsNullOrEmpty(key) && !String.IsNullOrEmpty(value))
            {
                tags.Add(key, value);
            }
            reader.MoveToElement();
        }

        private static void ReadWayAttributes(XmlReader reader, ref string osmId, ref string version)
        {
            int attributeCount = reader.AttributeCount;
            reader.MoveToFirstAttribute();
            for (int attrId = 0; attrId < attributeCount; attrId++)
            {
                switch (reader.Name)
                {
                    case "id":
                        osmId = reader.GetAttribute(attrId);
                        break;
                    case "version":
                        version = reader.GetAttribute(attrId);
                        break;
                }
                reader.MoveToNextAttribute();
            }
            reader.MoveToElement();
        }

    }
}

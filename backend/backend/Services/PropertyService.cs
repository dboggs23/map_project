using backend.Models;
using backend.Services;
using System.Text.Json;

namespace backend.Services
{
    public class MostRecentPrice
    {
        public Property? PropertyResult { get; set; }
        public int? MostRecentHomePrice { get; set; }

    }
public class PropertyService
    {
        private static MapContext databaseConnection = new MapContext();

        
    
        public static List<MostRecentPrice> MostRecentPrices()
        {
            Property properties = databaseConnection.Properties.First();

            var query = from property in databaseConnection.Set<Property>()
                        join propertyEvent in databaseConnection.Set<PropertyEvent>()
                        on property.Id equals propertyEvent.PropertyId into joined
                        //where propertyEvent.Price != null 
                        //group propertyEvent by propertyEvent.PropertyId into p
                        select new MostRecentPrice
                        {
                            PropertyResult = property,
                            MostRecentHomePrice = joined.Max(r => r.Price)
                        };

            var joinResult = query.ToList();

            var options = new JsonSerializerOptions
            {
                WriteIndented = true
            };

            var jsonString = JsonSerializer.Serialize(joinResult, options);

            return joinResult;
        }

    }
}

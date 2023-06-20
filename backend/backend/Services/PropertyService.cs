using backend.Models;
using System.Text.Json;
using static System.Net.Mime.MediaTypeNames;

namespace backend.Services
{
    public class MostRecentPrice
    {
        public Property? PropertyResult { get; set; }
        public int? MostRecentHomePrice { get; set; }

    }

    public class PropertiesGroupedByYear
    {
        public string Year { get; set; }
        public int Count { get; set; }
    }
    public class PropertyService
    {
        private static MapContext databaseConnection = new MapContext();



        public static List<MostRecentPrice> MostRecentPrices()
        {

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

        public static List<PropertiesGroupedByYear> PropertiesByYearMethod()
        {
            List<PropertiesGroupedByYear> formattedPropsList = new List<PropertiesGroupedByYear>();

            var query = databaseConnection
                        .Properties
                        .GroupBy(prop => prop.YearBuilt)
                        .Select(prop => new { Year = prop.Key, Count = prop.Count() })
                        .OrderBy(prop => prop.Year);
            var result = query.ToList();
            int count = result.Count;

            int i = 1;
            while (i < result.Count)
            {
                var properties = result.Skip(i).Take(6);
                string yearsString = $"{properties.First().Year} - {properties.Last().Year}";
                int totalPropertiesBuilt = properties.ToList().Aggregate(0, (acc, x) => acc + x.Count);

                var propsObj = new PropertiesGroupedByYear { Count = totalPropertiesBuilt, Year = yearsString };

                formattedPropsList.Add(propsObj);

                i +=5;
            }




            return formattedPropsList;

        }

    }
}

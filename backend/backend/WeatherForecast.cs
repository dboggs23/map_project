using System.Reflection.Metadata.Ecma335;

namespace backend
{
    public class WeatherForecast
    {
        public DateTime Date { get; set; }

        public int TemperatureC { get; set; }

        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

        public string test() {
            return "hello";
            }

        public string? Summary { get; set; }
    }
}
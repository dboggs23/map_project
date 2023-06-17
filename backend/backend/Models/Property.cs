using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Property
{
    public int Id { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public int? Zipcode { get; set; }

    public int? Beds { get; set; }

    public double? Baths { get; set; }

    public string? Location { get; set; }

    public int? SquareFootage { get; set; }

    public int? LotSize { get; set; }

    public int? YearBuilt { get; set; }

    public string? Url { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public virtual ICollection<PropertyEvent> PropertyEvents { get; set; } = new List<PropertyEvent>();
}

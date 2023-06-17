using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class PropertyEvent
{
    public int Id { get; set; }

    public int? PropertyId { get; set; }

    public DateOnly? Date { get; set; }

    public int? Price { get; set; }

    public string? Status { get; set; }

    public virtual Property? Property { get; set; }
}

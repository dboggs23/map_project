using System;
using System.Collections.Generic;
using System.Diagnostics;
using backend.Configuration;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class MapContext : DbContext
{

    public MapContext()
    {}

    public MapContext(DbContextOptions<MapContext> options)
        : base(options)
    {
    }


    public virtual DbSet<Property> Properties { get; set; }

    public virtual DbSet<PropertyEvent> PropertyEvents { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql(AppSettings.dbConnection);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Property>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("property_pkey");

            entity.ToTable("property");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Address)
                .HasColumnType("character varying")
                .HasColumnName("address");
            entity.Property(e => e.Baths).HasColumnName("baths");
            entity.Property(e => e.Beds).HasColumnName("beds");
            entity.Property(e => e.City)
                .HasColumnType("character varying")
                .HasColumnName("city");
            entity.Property(e => e.Latitude).HasColumnName("latitude");
            entity.Property(e => e.Location)
                .HasColumnType("character varying")
                .HasColumnName("location");
            entity.Property(e => e.Longitude).HasColumnName("longitude");
            entity.Property(e => e.LotSize).HasColumnName("lotSize");
            entity.Property(e => e.SquareFootage).HasColumnName("squareFootage");
            entity.Property(e => e.State)
                .HasColumnType("character varying")
                .HasColumnName("state");
            entity.Property(e => e.Url)
                .HasColumnType("character varying")
                .HasColumnName("url");
            entity.Property(e => e.YearBuilt).HasColumnName("yearBuilt");
            entity.Property(e => e.Zipcode).HasColumnName("zipcode");
        });

        modelBuilder.Entity<PropertyEvent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("property_events_pkey");

            entity.ToTable("property_events");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.PropertyId).HasColumnName("propertyId");
            entity.Property(e => e.Status)
                .HasColumnType("character varying")
                .HasColumnName("status");

            entity.HasOne(d => d.Property).WithMany(p => p.PropertyEvents)
                .HasForeignKey(d => d.PropertyId)
                .HasConstraintName("property_events_propertyId_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

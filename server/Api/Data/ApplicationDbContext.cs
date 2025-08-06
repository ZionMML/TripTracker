using Api.Models;
using AutoMapper;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<ProfilePhoto> ProfilePhotos { get; set; } = null!;

    public DbSet<TripPhoto> TripPhotos { get; set; } = null!;

    public DbSet<Trip> Trips { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder
            .Entity<ApplicationUser>()
            .HasOne(u => u.ProfilePhoto)
            .WithOne(p => p.User)
            .HasForeignKey<ProfilePhoto>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .Entity<Trip>()
            .HasOne(t => t.User)
            .WithMany(u => u.Trips)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .Entity<Trip>()
            .HasMany(t => t.TripPhotos)
            .WithOne(p => p.Trip)
            .HasForeignKey(p => p.TripId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

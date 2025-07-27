using Api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<ProfilePhoto> ProfilePhotos { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder
            .Entity<ApplicationUser>()
            .HasOne(u => u.ProfilePhoto)
            .WithOne(p => p.User)
            .HasForeignKey<ProfilePhoto>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

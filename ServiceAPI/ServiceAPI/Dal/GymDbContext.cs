using Microsoft.EntityFrameworkCore;

namespace ServiceAPI.Dal
{
    public class GymDbContext : DbContext
    {
        public DbSet<Class> Classes { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<Trainer> Trainers { get; set; }
        public DbSet<Training> Trainings { get; set; }
        public DbSet<TrainingProgram> TrainingPrograms { get; set; }
        public DbSet<TrainingRoom> TrainingRooms { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<WorkoutEquipment> WorkoutEquipments { get; set; }

        //Db configuration
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder
                //.UseMySql(@"Server=localhost;database=O55000354_gymDatabase;uid=corso;pwd=unict;");   // with psw
                .UseMySql(@"Server=localhost;database=O55000354_gymDatabase;uid=root;");                // without psw

        //Mapping
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Membership>().HasKey(t => new { t.ClassName, t.UserFC });               // composite primary key
            modelBuilder.Entity<Training>().HasKey(t => new { t.ClassName, t.TrainerFC });              // composite primary key
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())                             // for each entity model create a table in db
            {
                // Skip shadow types
                if (entityType.ClrType == null)
                    continue;

                entityType.Relational().TableName = entityType.ClrType.Name;
            }
            base.OnModelCreating(modelBuilder);
        }
    }
}

using AngularAuthApi.entities;
using AngularAuthApi.models;
using Microsoft.EntityFrameworkCore;

namespace AngularAuthApi.context
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext>options):base(options)
        {

        }
        public DbSet<user> Utilisateurs { get; set; }
        public DbSet<demande> demandes{ get; set; }
       public DbSet<Adresse> adresses { get; set; }
        public DbSet<semaine_type> semaines { get; set; }
        public DbSet<Contrat> contrats { get; set; }
        public DbSet<Notification> notifs { get; set; }
        public DbSet<Jour_type> jours_type { get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<user>().ToTable("Utilisateur").HasKey(x => x.Id);
            modelBuilder.Entity<demande>().ToTable("Demande").HasKey(x => x.id_demande);
            modelBuilder.Entity<Adresse>().ToTable("Adresse").HasKey(x => x.id_adresse);
            modelBuilder.Entity<Contrat>().ToTable("Contrat").HasKey(x => x.id_contrat);
            modelBuilder.Entity<semaine_type>().ToTable("Semaine_type").HasKey(x => x.id_semaine);
            modelBuilder.Entity<Jour_type>().ToTable("Jour_type").HasKey(x => x.id_jour);
            modelBuilder.Entity<Notification>().ToTable("Notif").HasKey(x => x.id_notif);

            /*modelBuilder.Entity<Contrat>()
            .HasOne(c => c.user) // Propriété de navigation vers l'entité Client
            .WithMany(c=>c.contrats) // Si un Client peut avoir plusieurs Contrats, utilisez .WithMany(c => c.Contrats)
            .HasForeignKey(c => c.id_user);*/
        }


    }
}

﻿// <auto-generated />
using System;
using AngularAuthApi.context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace AngularAuthApi.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.9")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("AngularAuthApi.models.demande", b =>
                {
                    b.Property<int>("id_demande")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id_demande"));

                    b.Property<DateTime>("date_debut")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("date_fin")
                        .HasColumnType("datetime2");

                    b.Property<byte>("statut_en_cours")
                        .HasColumnType("tinyint");

                    b.HasKey("id_demande");

                    b.ToTable("demande", (string)null);
                });

            modelBuilder.Entity("AngularAuthApi.models.user", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("RefreshToken")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("RefreshTokenExpiryTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Token")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("mot_de_passe")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("nom")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("prenom")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("role")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Utilisateur", (string)null);
                });
#pragma warning restore 612, 618
        }
    }
}

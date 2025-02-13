using AngularAuthApi.context;
using AngularAuthApi.entities;
using AngularAuthApi.models;
using AngularAuthApi.models.Enums;
using AngularAuthApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;

namespace AngularAuthApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]

    public class demandeController : ControllerBase
    {

        private readonly AppDbContext _demandeContext;


        public demandeController(AppDbContext appContext)
        {

            _demandeContext = appContext;

        }

        [HttpGet("get_demande/" + "{id}")]

        public IActionResult GetDemande(int id)
        {
            var demandes = _demandeContext.demandes
                .Where(x => x.id_contrat == id)
                .Select(x =>
                new demande_model
                {
                    id_demande = x.id_demande,
                    date_debut = x.date_debut,
                    date_fin = x.date_fin,

                    description = x.description,
                    statut_en_cours = x.statut_en_cours.ToString(),
                    id_contrat = x.id_contrat,
                    id_adresse = x.id_adresse

                }).ToList();

            TimeZoneInfo userTimeZone = TimeZoneInfo.Local;
            demandes.ForEach(x =>
            {
                x.date_debut = TimeZoneInfo.ConvertTimeFromUtc(x.date_debut, userTimeZone);

                x.date_fin = TimeZoneInfo.ConvertTimeFromUtc(x.date_fin, userTimeZone);
            });


            return Ok(demandes);
        }



        [HttpDelete("supprimer_demande/" + "{id}")]
        public IActionResult DeleteDemande(int id)
        {
            try
            {
                var demande_supp = _demandeContext.demandes.FirstOrDefault(x => x.id_demande == id);
                if (demande_supp == null)
                {
                    return NotFound();
                }
                _demandeContext.demandes.Remove(demande_supp);
                _demandeContext.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Erreur lors de la suppression de la demande : {ex.Message}");
            }
        }

        [HttpPost("enregistrer_demande")]
        public IActionResult SaveDemande([FromBody] demande model)
        {
            try
            {
                demande demande = model.id_demande > 0 ? _demandeContext.demandes
                    .Include(x => x.adresse)
                    .FirstOrDefault(x => x.id_demande == model.id_demande) : new demande();

                TimeZoneInfo userTimeZone = TimeZoneInfo.Local;

                demande.date_debut = TimeZoneInfo.ConvertTimeToUtc(model.date_debut);

                demande.date_fin = TimeZoneInfo.ConvertTimeToUtc(model.date_fin);

                demande.id_demande = model.id_demande;
                if (model.id_adresse > 0) { demande.id_adresse = model.id_adresse; }
                demande.description = model.description;
                demande.id_contrat = model.id_contrat;


                if (demande.id_demande == 0)
                {
                    demande.statut_en_cours = statut_demande_type.en_attente;

                    // Create a new "demande" since it does not have an ID
                    _demandeContext.demandes.Add(demande);
                    try
                    {
                        var contrat = _demandeContext.contrats?.Include(x => x.user)
                            .FirstOrDefault(x => x.id_contrat == model.id_contrat);
                        if (contrat != null)
                        {
                            int? manager_id = contrat.user.id_manager;

                            if (manager_id.HasValue)
                                send_notification($"Une demande vient d'être deposée par '{demande.Contrat.user.nom} {demande.Contrat.user.prenom} '", manager_id.Value);
                        }
                    }
                    catch (Exception ex) { return null; }
                }


                // Save changes to the database
                _demandeContext.SaveChanges();
                return Ok(new { Message = "okkk" }); ; // Return the saved "demande" object
            }
            catch (Exception ex)
            {
                // Handle any potential exceptions, such as database concurrency issues
                Console.WriteLine("Error saving demande: " + ex.Message);
                return null;
            }
        }

        [HttpGet("get_manager_demandes/" + "{managerId}")]

        public IActionResult GetDemandeByManagerId(int managerId)
        {
            var demandes = _demandeContext.demandes?
                .Where(x => x.Contrat != null && x.Contrat.user != null && x.Contrat.user.id_manager == managerId && x.statut_en_cours == statut_demande_type.en_attente)
                .Select(x =>
                new demande_model
                {
                    employeeFullName = x.Contrat.user.prenom + " " + x.Contrat.user.nom,
                    id_demande = x.id_demande,
                    date_debut = x.date_debut,
                    date_fin = x.date_fin,
                    description=x.description,
                    statut_en_cours = x.statut_en_cours.ToString(),
                    id_contrat = x.id_contrat,
                }).ToList();

            TimeZoneInfo userTimeZone = TimeZoneInfo.Local;
            demandes.ForEach(x =>
            {
                x.date_debut = TimeZoneInfo.ConvertTimeFromUtc(x.date_debut, userTimeZone);
                x.date_fin = TimeZoneInfo.ConvertTimeFromUtc(x.date_fin, userTimeZone);
            });
            return Ok(demandes);
        }

        [HttpGet("get_demandes_for_gantt/" + "{managerId}")]

        public IActionResult GetDemandeForGantt(int managerId)
        {
            var demandes = _demandeContext.demandes?.Include(x => x.Contrat).ThenInclude(x => x.user)
                .Where(x => x.Contrat != null && x.Contrat.user != null
                && x.Contrat.user.id_manager == managerId && x.statut_en_cours == statut_demande_type.acceptee)
                .OrderBy(x => x.date_debut).ToList();
            List<gantt_model> calender = new List<gantt_model>();
            TimeZoneInfo userTimeZone = TimeZoneInfo.Local;

            if (demandes == null) { return Ok(calender); }
            int i = 0;


            foreach (var item in demandes)
            {
                var user_full_name = item.Contrat.user.prenom + ' ' + item.Contrat.user.nom;
                var semaineId = item.Contrat.id_semaine;
                var adresseId = item.id_adresse;
                var adresseName = _demandeContext.demandes?.Include(x => x.adresse).FirstOrDefault(x => x.id_adresse == adresseId);


                if (calender.Any(x => x.taskName == user_full_name) == false)
                {

                    i++;

                    var new_row = new gantt_model
                    {
                        taskId = i,
                        taskName = user_full_name,
                        startDate = TimeZoneInfo.ConvertTimeFromUtc(item.date_debut, userTimeZone),
                        subtasks = new List<Subtask>()
                    };
                    calender.Add(new_row);
                }
                i++;



                var jours_teletravail = get_intervalle_dates(item.date_debut, item.date_fin, semaineId);

                var new_task = new Subtask
                {
                    taskId = i,
                    taskName = adresseName.adresse?.lieu,
                    startDate = TimeZoneInfo.ConvertTimeFromUtc(item.date_debut, userTimeZone),
                    endDate = TimeZoneInfo.ConvertTimeFromUtc(item.date_fin, userTimeZone),
                    segments = GetIntervals(jours_teletravail)
                             .Select(x => new Segment
                             {
                                 startDate = x.Item1,
                                 endDate = x.Item2,

                                 duration = (int)(x.Item2 - x.Item1).TotalDays +1 
                             }).ToList(),

                    duration = jours_teletravail.Count



                };
                calender.FirstOrDefault(x => x.taskName == user_full_name).subtasks.Add(new_task);


            }

            return Ok(calender);
        }
        private List<(DateTime, DateTime)> GetIntervals(List<DateTime> dates)
        {
            var sortedList = dates.OrderBy(dt => dt).ToList();
            List<(DateTime startDate, DateTime endDate)> intervals = new List<(DateTime, DateTime)>();
            if (sortedList.Count > 0)
            {
                DateTime intervalStart = sortedList[0];
                DateTime intervalEnd = sortedList[0];

                for (int i = 1; i < sortedList.Count; i++)
                {
                    if ((sortedList[i] - intervalEnd).TotalDays > 1)
                    {
                        intervals.Add((intervalStart, intervalEnd));
                        intervalStart = sortedList[i];
                    }
                    intervalEnd = sortedList[i];
                }

                intervals.Add((intervalStart, intervalEnd));
            }
            return intervals;
        }


        [HttpGet("get_manager_historique_demande/" + "{managerId}")]

        public IActionResult Get_Historique_dmd_Manager(int managerId)
        {
            var demandes = _demandeContext.demandes?
                .Where(x => x.Contrat != null && x.Contrat.user != null && x.Contrat.user.id_manager == managerId)
                .Select(x =>
                new demande_model
                {
                    employeeFullName = x.Contrat.user.prenom + " " + x.Contrat.user.nom,
                    id_demande = x.id_demande,
                    date_debut = x.date_debut,
                    date_fin = x.date_fin,
                    statut_en_cours = x.statut_en_cours.ToString(),
                    id_contrat = x.id_contrat,
                    raisons_refus = x.raisons_refus
                }).ToList();

            TimeZoneInfo userTimeZone = TimeZoneInfo.Local;
            demandes.ForEach(x =>
            {
                x.date_debut = TimeZoneInfo.ConvertTimeFromUtc(x.date_debut, userTimeZone);
                x.date_fin = TimeZoneInfo.ConvertTimeFromUtc(x.date_fin, userTimeZone);
            });
            return Ok(demandes);
        }

        [HttpPut("accepter_demande/" + "{id}")]
        public IActionResult AccepterDemande(int id)
        {
            try
            {
                var demande_a_accepter = _demandeContext.demandes
                    .Include(x => x.Contrat)
                    .FirstOrDefault(x => x.id_demande == id);
                if (demande_a_accepter == null)
                {
                    return NotFound();
                }
                demande_a_accepter.statut_en_cours = statut_demande_type.acceptee;
                int x = demande_a_accepter.Contrat.id_user;
                send_notification("Votre demande a été acceptée", x);
                _demandeContext.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Erreur lors de la acceptation de la demande : {ex.Message}");
            }
        }
        [HttpPut
            ("refuser_demande/" + "{id}")]
        public IActionResult RefuserDemande(int id, [FromBody] string reasons)

        {
            try
            {
                var demande_a_refuser = _demandeContext.demandes
                    .Include(x => x.Contrat)
                    .FirstOrDefault(x => x.id_demande == id);
                if (demande_a_refuser == null)
                {
                    return NotFound();
                }
                demande_a_refuser.statut_en_cours = statut_demande_type.refusee;
                demande_a_refuser.raisons_refus = reasons;
                int x = demande_a_refuser.Contrat.id_user;
                send_notification("Votre demande a été refusée", x);

                _demandeContext.SaveChanges();

                return Ok(new { Message = "okkk" }); ; // Return the saved "demande" object
            }
            catch (Exception ex)
            {
                return BadRequest($"Erreur lors du refus de la demande : {ex.Message}");
            }
        }
        private void send_notification(string corps, int id_user)
        {
            var notification = new Notification()
            {
                corps = corps,
                id_user = id_user,
                est_vue = false,
            };
            _demandeContext.notifs.Add(notification);

        }
        [HttpGet("get_jours_type/" + "{id_semaine}")]

        public IActionResult GetJoursFerier(int id_semaine)
        {
            var jours = get_jours_ferier(id_semaine);
            return Ok(jours);
        }
        private List<jour_type_model> get_jours_ferier(int id_semaine)
        {
            var jours_ferier = _demandeContext.jours_type
               .Include(x => x.semaine)
               .Where(x => x.semaine.id_semaine == id_semaine && x.est_calendaire == true)
                .Select(x =>
               new jour_type_model
               {

                   num_jour = x.num_jour,

               })
               .ToList();
            return jours_ferier;
        }
        private List<DateTime> get_intervalle_dates(DateTime date_debut, DateTime date_fin, int? id_semaine)
        {
            TimeZoneInfo userTimeZone = TimeZoneInfo.Local;

            date_debut = TimeZoneInfo.ConvertTimeFromUtc(date_debut, userTimeZone);
            date_fin = TimeZoneInfo.ConvertTimeFromUtc(date_fin, userTimeZone);
            var jours_Type = _demandeContext.jours_type
                        .Where(x => x.id_semaine == id_semaine && x.est_calendaire != true)
                        .Select(x => (DayOfWeek)x.num_jour).ToList();
            var liste = new List<DateTime>();
            for (DateTime date = date_debut; date <= date_fin; date = date.AddDays(1))
            {
                if (jours_Type.Contains(date.DayOfWeek))
                    liste.Add(date);
            }
            return liste;
        }


        [HttpGet("get_Accepted_demandes/" + "{id_contrat}")]
        public IActionResult getAcceptedDemands(int id_contrat)
        {
            try
            {
                List<DateTime> jours_teletravail = new List<DateTime>();
                var contrat = _demandeContext.contrats?.Include(x => x.semaine)
                             .FirstOrDefault(x => x.id_contrat == id_contrat);

                if (contrat != null && contrat.semaine != null)
                {
                    var semaine_type = contrat.semaine;


                    var demandes = _demandeContext.demandes.Include(x => x.Contrat)
                        .Where(x => x.id_contrat == id_contrat && x.statut_en_cours != statut_demande_type.refusee)
                        .ToList();
                    foreach (var demande in demandes)
                    {
                        jours_teletravail.AddRange(get_intervalle_dates(demande.date_debut, demande.date_fin, contrat.id_semaine));
                    }


                    return Ok(jours_teletravail.Distinct().ToList());
                }
                else { return Ok(jours_teletravail.ToList()); }
            }
            catch (Exception ex) { return null; }

        }
        [HttpGet("get_demandes_en_attente/" + "{id_contrat}")]
        public IActionResult getDemandesEnAttente(int id_contrat)
        {
            var demandes = _demandeContext.demandes
                .Where(x => x.id_contrat == id_contrat && x.statut_en_cours == statut_demande_type.en_attente)
                .Select(x =>
                new demande_model
                {
                    id_demande = x.id_demande,
                    date_debut = x.date_debut,
                    date_fin = x.date_fin,
                    description = x.description

                }).ToList();


            return Ok(demandes);
        }

    }
}





using AngularAuthApi.entities;
using AngularAuthApi.models.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AngularAuthApi.models
{
    public class demande_model
    {
        public string employeeFullName { get; set; }
        public int id_demande { get; set; }
        public int? id_adresse { get; set; }
        public DateTime date_debut { get; set; }
        public DateTime date_fin { get; set; }
        public string statut_en_cours { get; set; }
        public string description { get; set; }
        public string raisons_refus { get; set; }
        public int? id_contrat
        {
            get;
            set;
        }
        
    }
}

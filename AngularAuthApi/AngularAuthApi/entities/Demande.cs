using AngularAuthApi.models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AngularAuthApi.entities
{
    public class demande
    {
        [Key]
        public int id_demande { get; set; }
        public DateTime date_debut { get; set; }
        public DateTime date_fin { get; set;}
        public statut_demande_type statut_en_cours { get; set; }
        public string? raisons_refus { get; set; }
        public  string description { get; set; }
        public int? id_contrat
        {
            get;
            set;
        }

        [ForeignKey("id_contrat")]
        public virtual Contrat Contrat {   get;
            set;
        }
        public int? id_adresse
        {
            get;
            set;
        }

        [ForeignKey("id_adresse")]
        public virtual Adresse adresse
        {
            get;
            set;
        }


    }
}

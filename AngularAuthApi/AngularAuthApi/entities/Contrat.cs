using AngularAuthApi.Repositories.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AngularAuthApi.entities
{
    public class Contrat
    {
        public int id_contrat { get; set; }
        public type_contrat type_contrat { get; set; }
        public string poste { get; set; }
        public string nom_societe { get; set; }
        public DateTime date_debut { get; set; }
        public DateTime? date_fin { get; set; }
        
        public int  id_user{ get; set; }
        [ForeignKey("id_user")]
        public user user { get; set; }
        public int? id_semaine
        {
            get;
            set;
        }

        [ForeignKey("id_semaine")]
        public virtual semaine_type semaine
        {
            get;
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

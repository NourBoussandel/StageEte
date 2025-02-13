using System.ComponentModel.DataAnnotations.Schema;

namespace AngularAuthApi.entities
{
    public class Jour_type
    {
        public int id_jour { get; set; }
        public int nb_heures_travaille { get; set; }
        public bool est_calendaire { get; set; }
        public int num_jour { get; set; }
        public int id_semaine { get; set; }
      
        [ForeignKey("id_semaine")]
        public virtual semaine_type semaine
        {
            get;
            set;
        }
    }
}

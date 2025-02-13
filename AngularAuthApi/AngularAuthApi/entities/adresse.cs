using System.ComponentModel.DataAnnotations.Schema;

namespace AngularAuthApi.entities
{
    public class Adresse
    {
       public int  id_adresse { get; set; }
        public string lieu { get; set; }
        public string region { get; set; }
        public string ville { get; set; }

        public string pays { get; set; }
	public string code_postal { get; set; }

        public int? id_user
        {
            get;
            set;
        }

        [ForeignKey("id_user")]
        public virtual user user
        {
            get;
            set;
        }
    }
}

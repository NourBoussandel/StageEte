using System.ComponentModel.DataAnnotations.Schema;

namespace AngularAuthApi.entities
{
    public class semaine_type
    {
      public int id_semaine { get; set; }  
	  public  string nom_type { get; set; } 
	  public string description { get; set; }
       

    }
}

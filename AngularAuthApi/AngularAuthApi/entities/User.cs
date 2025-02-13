using AngularAuthApi.models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AngularAuthApi.entities
{
    public class user 
    {
        public int Id { get; set; }
        public string nom { get; set; }
        public string prenom { get; set; }
        public role_type role { get; set; }
        public string mot_de_passe { get; set; }
        public string Token { get; set; }
        public string email { get; set; }
        public string numero_tel { get; set; }
       
        public string RefreshToken { get; set; }

       public DateTime? RefreshTokenExpiryTime { get; set; }

        [InverseProperty("user")]
        public  ICollection<Contrat> contrats
        {
            get;
            set;
        }

        public int? id_manager { get; set; }
        [ForeignKey("id_manager")]
        public virtual user manager { get; set; }
    }
}

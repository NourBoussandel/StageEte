using AngularAuthApi.models.Enums;

namespace AngularAuthApi.models
{
    public class user_model
    {
        public int Id { get; set; }
        public string nom { get; set; }
        public string prenom { get; set; }
        public string email { get; set; }
        public string numero_tel { get; set; }
        public string role { get; set; }
    }
}

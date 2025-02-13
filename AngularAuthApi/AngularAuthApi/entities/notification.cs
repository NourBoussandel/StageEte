using System.ComponentModel.DataAnnotations.Schema;

namespace AngularAuthApi.entities
{
    public class Notification
    {
        public int id_notif { get; set; }
        public string corps { get; set; }
        public bool est_vue { get; set; }
        public int id_user { get; set; }
        [ForeignKey("id_user")]
        public virtual user user { get; set; }
    }
}

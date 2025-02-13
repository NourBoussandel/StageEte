using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace AngularAuthApi.models
{
    public class Subtask
    {
        public int taskId { get; set; }
        public string taskName { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public  List<Segment> segments { get; set; }
        public int duration { get; set; }



    }
}

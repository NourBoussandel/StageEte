namespace AngularAuthApi.models
{
   
    public class gantt_model
    { 
        public int taskId { get; set; }
        public string taskName { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
       public List<Subtask> subtasks { get; set; }

    }
}

namespace AngularAuthApi.models
{
    public class Segment
    {
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public int segmentId { get; set; }
        public int duration { get; set; } = 1; 
    }
}

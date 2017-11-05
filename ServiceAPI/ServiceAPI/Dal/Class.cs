using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceAPI.Dal
{
    public class Class
    {
        [Key]
        public string Name { get; set; }
        public string Description { get; set; }
        public string TimeTable { get; set; }
        public string TrainingRoomName { get; set; }        

        [ForeignKey("TrainingRoomName")]            
        public TrainingRoom TrainingRoom { get; set; }
    }

}

using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceAPI.Dal
{
    public class WorkoutEquipment
    {
        [Key]
        public string Name { get; set; }
        public string Purpose { get; set; }
        public string TrainingRoomName { get; set; }

        [ForeignKey("TrainingRoomName")]           
        public TrainingRoom TrainingRoom { get; set; }
    }
}

using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceAPI.Dal
{
    public class User
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Address { get; set; }
        [Key]
        public string FC { get; set; }              // Fiscal Code
        public int TrainingProgramId { get; set; }  

        [ForeignKey("TrainingProgramId")]
        public TrainingProgram TrainingProgram { get; set; }
    }
}

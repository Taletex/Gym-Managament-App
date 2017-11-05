using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace ServiceAPI.Dal
{
    public class TrainingProgram
    {
        [Key]
        public int Id { get; set; }
        public string Description { get; set; }
    }
}

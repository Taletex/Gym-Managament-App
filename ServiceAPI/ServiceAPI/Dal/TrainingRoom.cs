using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace ServiceAPI.Dal
{
    public class TrainingRoom
    {
        [Key]
        public string Name { get; set; }
    }
}

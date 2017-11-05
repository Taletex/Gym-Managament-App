using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace ServiceAPI.Dal
{
    public class Trainer
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Address { get; set; }
        [Key]
        public string FC { get; set; }
        public string Workshift { get; set; }
    }
}

using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceAPI.Dal
{
    public class Training
    {
        public string ClassName { get; set; }
        public string TrainerFC { get; set; }

        [ForeignKey("ClassName")]
        public Class Class { get; set; }

        [ForeignKey("TrainerFC")]
        public Trainer Trainer { get; set; }
    }
}

using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceAPI.Dal
{
    public class Membership
    {
        public string ClassName { get; set; }    
        public string UserFC { get; set; }

        [ForeignKey("ClassName")]
        public Class Class { get; set; }

        [ForeignKey("UserFC")]
        public User User { get; set; }
    }
}

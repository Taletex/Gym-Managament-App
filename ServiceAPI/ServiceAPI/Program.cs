using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using ServiceAPI.Dal;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ServiceAPI
{
    class Program
    {
        static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel()               //Integrated WebServer
                .UseStartup<Startup>()      //Services and request pipeline configuration
                .Build();

            Task restService = host.RunAsync();
            
            restService.Wait();
        }
    }
}

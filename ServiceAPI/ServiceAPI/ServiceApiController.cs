using Microsoft.AspNetCore.Mvc;
using ServiceAPI.Dal;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading;

namespace ServiceAPI
{
    [Route("api")]
    public class ServiceApiController : Controller
    {
        static readonly object setupLock = new object();
        static readonly SemaphoreSlim parallelism = new SemaphoreSlim(2);

        // Setup - create and populate database
        [HttpGet("setup")]
        public IActionResult SetupDatabase([FromQuery]string par)
        {
            lock (setupLock)
            {
                using (var context = new GymDbContext())
                {
                    // Create database
                    if (context.Database.EnsureCreated())   
                    {   
                        // If user wants, database is created with some istances of records.
                        if (par == "y")
                        {
                            Test test = new Test();
                            test.TestAPIcontroller();
                            return Ok("Database created and populated");
                        }
                        else
                        {
                            return Ok("Database created");
                        }
                    }

                }
                return Ok("Database already exists");               
            }
        }

        // Drop database
        [HttpGet("drop")]
        public IActionResult DropDatabase()
        {
            lock (setupLock)
            {
                using (var context = new GymDbContext())
                {
                    if (context.Database.EnsureDeleted())   
                    {
                        return Ok("Database deleted");
                    }

                }
                return Ok("No database found");      
            }
        }


        /* ---------- TrainingRooms methods ---------- */
        // Get all training rooms
        [HttpGet("trainingrooms")]
        public async Task<IActionResult> GetTrainingRooms()
        {
            try
            {
                await parallelism.WaitAsync();

                using (var context = new GymDbContext())
                {
                    return Ok(await context.TrainingRooms.ToListAsync());
                }
            }
            finally
            {
                parallelism.Release();
            }
        }

        // Get a specific training room (based on "name")
        [HttpGet("trainingroom")]
        public async Task<IActionResult> GetTrainingRoom([FromQuery]string name)
        {
            using (var context = new GymDbContext())
            {
                return Ok(await context.TrainingRooms.FirstOrDefaultAsync(x => x.Name == name));
            }
        }

        // Insert a new training room
        [HttpPut("trainingrooms")]
        public async Task<IActionResult> CreateTrainingRoom([FromBody]TrainingRoom trainingRoom)
        {
            using (var context = new GymDbContext())
            {
                context.TrainingRooms.Add(trainingRoom);

                await context.SaveChangesAsync();

                return Ok();
            }
        }

        // Update an existing training room
        [HttpPost("trainingrooms")]
        public async Task<IActionResult> UpdateTrainingRoom([FromBody]TrainingRoom trainingRoom)
        {
            using (var context = new GymDbContext())
            {
                context.TrainingRooms.Update(trainingRoom);
                await context.SaveChangesAsync();
                return Ok();
            }
        }

        // Delete an existing training room
        [HttpDelete("trainingrooms")]
        public async Task<IActionResult> DeleteTrainingRoom([FromQuery]string name)
        {
            using (var context = new GymDbContext())
            {
                var trainingRoom = await context.TrainingRooms.FirstOrDefaultAsync(x => x.Name == name);
                if (trainingRoom != null)
                {
                    context.TrainingRooms.Remove(trainingRoom);
                    await context.SaveChangesAsync();
                }
                return Ok();
            }
        }

        /* ---------- Classes methods ----------  */
        // Get all classes
        [HttpGet("classes")]
        public async Task<IActionResult> GetClasses()
        {
            try
            {
                await parallelism.WaitAsync();

                using (var context = new GymDbContext())
                {
                    return Ok(await context.Classes.ToListAsync());
                }
            }
            finally
            {
                parallelism.Release();
            }
        }

        // Get a specific class (based on "name")
        [HttpGet("class")]
        public async Task<IActionResult> GetClass([FromQuery]string name)
        {
            using (var context = new GymDbContext())
            {
                return Ok(await context.Classes.FirstOrDefaultAsync(x => x.Name == name));		
            }
        }

        // Insert a new class
        [HttpPut("classes")]
        public async Task<IActionResult> CreateClass([FromBody]Class class_)
        {
            using (var context = new GymDbContext())
            {
                context.Classes.Add(class_);

                await context.SaveChangesAsync();

                return Ok();
            }
        }

        // Update an existing class
        [HttpPost("classes")]
        public async Task<IActionResult> UpdateClass([FromBody]Class class_)
        {
            using (var context = new GymDbContext())
            {
                context.Classes.Update(class_);
                await context.SaveChangesAsync();
                return Ok();
            }
        }

        // Delete an existing class
        [HttpDelete("classes")]
        public async Task<IActionResult> DeleteClass([FromQuery]string name)
        {
            using (var context = new GymDbContext())
            {
                var class_ = await context.Classes.FirstOrDefaultAsync(x => x.Name == name);
                if (class_ != null)
                {
                    context.Classes.Remove(class_);
                    await context.SaveChangesAsync();
                }
                return Ok();
            }
        }

        /* ---------- TrainingPrograms methods ---------- */
        // Get all training programs
        [HttpGet("trainingprograms")]
        public async Task<IActionResult> GetTrainingPrograms()
        {
            try
            {
                await parallelism.WaitAsync();

                using (var context = new GymDbContext())
                {
                    return Ok(await context.TrainingPrograms.ToListAsync());
                }
            }
            finally
            {
                parallelism.Release();
            }
        }

        // Get a specific training program (based on "id")
        [HttpGet("trainingprogram")]
        public async Task<IActionResult> GetTrainingProgram([FromQuery]int id)
        {
            using (var context = new GymDbContext())
            {
                return Ok(await context.TrainingPrograms.FirstOrDefaultAsync(x => x.Id == id));		
            }
        }

        // Insert a new training program
        [HttpPut("trainingprograms")]
        public async Task<IActionResult> CreateTrainingProgram([FromBody]TrainingProgram trainingProgram)
        {
            using (var context = new GymDbContext())
            {
                context.TrainingPrograms.Add(trainingProgram);

                await context.SaveChangesAsync();

                return Ok();
            }
        }

        // Update an existing training program
        [HttpPost("trainingprograms")]
        public async Task<IActionResult> UpdateTrainingProgram([FromBody]TrainingProgram trainingProgram)
        {
            using (var context = new GymDbContext())
            {
                context.TrainingPrograms.Update(trainingProgram);
                await context.SaveChangesAsync();
                return Ok();
            }
        }

        // Delete an existing training program
        [HttpDelete("trainingprograms")]
        public async Task<IActionResult> DeleteTrainingProgram([FromQuery]int id)
        {
            using (var context = new GymDbContext())
            {
                var trainingprogram = await context.TrainingPrograms.FirstOrDefaultAsync(x => x.Id == id);
                if (trainingprogram != null)
                {
                    context.TrainingPrograms.Remove(trainingprogram);
                    await context.SaveChangesAsync();
                }
                return Ok();
            }
        }


        /* ---------- Users methods ---------- */
        // Get all users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                await parallelism.WaitAsync();

                using (var context = new GymDbContext())
                {
                    return Ok(await context.Users.ToListAsync());
                }
            }
            finally
            {
                parallelism.Release();
            }
        }

        // Get a specific user (based on "Fiscal Code")
        [HttpGet("user")]
        public async Task<IActionResult> GetUser([FromQuery]string fc)
        {
            using (var context = new GymDbContext())
            {
                return Ok(await context.Users.FirstOrDefaultAsync(x => x.FC == fc));
            }
        }

        // Insert a new user
        [HttpPut("users")]
        public async Task<IActionResult> CreateUser([FromBody]User user)
        {
            using (var context = new GymDbContext())
            {
                context.Users.Add(user);

                await context.SaveChangesAsync();

                return Ok();
            }
        }

        // Update an existing user
        [HttpPost("users")]
        public async Task<IActionResult> UpdateUser([FromBody]User user)
        {
            using (var context = new GymDbContext())
            {
                context.Users.Update(user);
                await context.SaveChangesAsync();
                return Ok();
            }
        }

        // Delete an existing user
        [HttpDelete("users")]
        public async Task<IActionResult> DeleteUser([FromQuery]string fc)
        {
            using (var context = new GymDbContext())
            {
                var user = await context.Users.FirstOrDefaultAsync(x => x.FC == fc);
                if (user != null)
                {
                    context.Users.Remove(user);
                    await context.SaveChangesAsync();
                }
                return Ok();
            }
        }


        /* ---------- Memberships methods ---------- */
        // Get all memberships
        [HttpGet("memberships")]
        public async Task<IActionResult> GetMemberships()
        {
            try
            {
                await parallelism.WaitAsync();

                using (var context = new GymDbContext())
                {
                    return Ok(await context.Memberships.ToListAsync());
                }
            }
            finally
            {
                parallelism.Release();
            }
        }

        // Get a specific membership (based on "Class name and User FC")
        [HttpGet("membership")]
        public async Task<IActionResult> GetMembership([FromQuery]string className, [FromQuery]string userFc)
        {
            using (var context = new GymDbContext())
            {
                return Ok(await context.Memberships.FirstOrDefaultAsync(x => (x.ClassName == className) && (x.UserFC == userFc)));
            }
        }

        // Insert a new membership
        [HttpPut("memberships")]
        public async Task<IActionResult> CreateMembership([FromBody]Membership membership)
        {
            using (var context = new GymDbContext())
            {
                context.Memberships.Add(membership);

                await context.SaveChangesAsync();

                return Ok();
            }
        }

        // Update an existing membership
        [HttpPost("memberships")]
        public async Task<IActionResult> UpdateMembership([FromBody]Membership membership)
        {
            using (var context = new GymDbContext())
            {
                context.Memberships.Update(membership);
                await context.SaveChangesAsync();
                return Ok();
            }
        }

        // Delete an existing membership
        [HttpDelete("memberships")]
        public async Task<IActionResult> DeleteMembership([FromQuery]string className, [FromQuery]string userFc)
        {
            using (var context = new GymDbContext())
            {
                var membership = await context.Memberships.FirstOrDefaultAsync(x => (x.ClassName == className) && (x.UserFC == userFc));
                if(membership != null)
                {
                    context.Memberships.Remove(membership);
                    await context.SaveChangesAsync();
                }
                return Ok();
            }
        }


        /* ---------- Workout equipment methods ---------- */
        // Get all workout equipments
        [HttpGet("workoutequipments")]
        public async Task<IActionResult> GetWorkoutEquipments()
        {
            try
            {
                await parallelism.WaitAsync();

                using (var context = new GymDbContext())
                {
                    return Ok(await context.WorkoutEquipments.ToListAsync());
                }
            }
            finally
            {
                parallelism.Release();
            }
        }

        // Get a specific workout equipment (based on "name")
        [HttpGet("workoutequipment")]
        public async Task<IActionResult> GetWorkoutEquipment([FromQuery]string name)
        {
            using (var context = new GymDbContext())
            {
                return Ok(await context.WorkoutEquipments.FirstOrDefaultAsync(x => x.Name == name));
            }
        }

        // Insert a new workout equipment
        [HttpPut("workoutequipments")]
        public async Task<IActionResult> CreateWorkoutEquipment([FromBody]WorkoutEquipment workoutequipment)
        {
            using (var context = new GymDbContext())
            {
                context.WorkoutEquipments.Add(workoutequipment);

                await context.SaveChangesAsync();

                return Ok();
            }
        }

        // Update an existing workout equipment
        [HttpPost("workoutequipments")]
        public async Task<IActionResult> UpdateWorkoutEquipment([FromBody]WorkoutEquipment workoutequipment)
        {
            using (var context = new GymDbContext())
            {
                context.WorkoutEquipments.Update(workoutequipment);
                await context.SaveChangesAsync();
                return Ok();
            }
        }

        // Delete an existing workout equipment
        [HttpDelete("workoutequipments")]
        public async Task<IActionResult> DeleteWorkoutEquipment([FromQuery]string name)
        {
            using (var context = new GymDbContext())
            {
                var workoutequipment = await context.WorkoutEquipments.FirstOrDefaultAsync(x => x.Name == name);
                if(workoutequipment != null)
                {
                    context.WorkoutEquipments.Remove(workoutequipment);
                    await context.SaveChangesAsync();
                }
                return Ok();
            }
        }


        /* ---------- Trainers methods ---------- */
        // Get all trainers
        [HttpGet("trainers")]
        public async Task<IActionResult> GetTrainers()
        {
            try
            {
                await parallelism.WaitAsync();

                using (var context = new GymDbContext())
                {
                    return Ok(await context.Trainers.ToListAsync());
                }
            }
            finally
            {
                parallelism.Release();
            }
        }

        // Get a specific trainer (based on "Fiscal Code")
        [HttpGet("trainer")]
        public async Task<IActionResult> GetTrainer([FromQuery]string fc)
        {
            using (var context = new GymDbContext())
            {
                return Ok(await context.Trainers.FirstOrDefaultAsync(x => x.FC == fc));
            }
        }

        // Insert a new trainer
        [HttpPut("trainers")]
        public async Task<IActionResult> CreateTrainer([FromBody]Trainer trainer)
        {
            using (var context = new GymDbContext())
            {
                context.Trainers.Add(trainer);

                await context.SaveChangesAsync();

                return Ok();
            }
        }

        // Update an existing trainer
        [HttpPost("trainers")]
        public async Task<IActionResult> UpdateTrainer([FromBody]Trainer trainer)
        {
            using (var context = new GymDbContext())
            {
                context.Trainers.Update(trainer);
                await context.SaveChangesAsync();
                return Ok();
            }
        }

        // Delete an existing trainer
        [HttpDelete("trainers")]
        public async Task<IActionResult> DeleteTrainer([FromQuery]string fc)
        {
            using (var context = new GymDbContext())
            {
                var trainer = await context.Trainers.FirstOrDefaultAsync(x => x.FC == fc);
                if(trainer != null)
                {
                    context.Trainers.Remove(trainer);
                    await context.SaveChangesAsync();
                }
                return Ok();
            }
        }


        /* ---------- Trainings methods ---------- */
        // Get all trainings
        [HttpGet("trainings")]
        public async Task<IActionResult> GetTrainings()
        {
            try
            {
                await parallelism.WaitAsync();

                using (var context = new GymDbContext())
                {
                    return Ok(await context.Trainings.ToListAsync());
                }
            }
            finally
            {
                parallelism.Release();
            }
        }

        // Get a specific training (based on "Class name and Trainer FC")
        [HttpGet("training")]
        public async Task<IActionResult> GetTraining([FromQuery]string className, [FromQuery]string trainerFc)
        {
            using (var context = new GymDbContext())
            {
                return Ok(await context.Trainings.FirstOrDefaultAsync(x => (x.ClassName == className) && (x.TrainerFC == trainerFc)));
            }
        }

        // Insert a new training
        [HttpPut("trainings")]
        public async Task<IActionResult> CreateTraining([FromBody]Training training)
        {
            using (var context = new GymDbContext())
            {
                context.Trainings.Add(training);

                await context.SaveChangesAsync();

                return Ok();
            }
        }

        // Update an existing training
        [HttpPost("trainings")]
        public async Task<IActionResult> UpdateTraining([FromBody]Training training)
        {
            using (var context = new GymDbContext())
            {
                context.Trainings.Update(training);
                await context.SaveChangesAsync();
                return Ok();
            }
        }

        // Delete an existing training
        [HttpDelete("trainings")]
        public async Task<IActionResult> DeleteTraining([FromQuery]string className, [FromQuery]string trainerFc)
        {
            using (var context = new GymDbContext())
            {
                var training = await context.Trainings.FirstOrDefaultAsync(x => (x.ClassName == className) && (x.TrainerFC == trainerFc));
                if(training != null)
                {
                    context.Trainings.Remove(training);
                    await context.SaveChangesAsync();
                }
                return Ok();
            }
        }

    }
}

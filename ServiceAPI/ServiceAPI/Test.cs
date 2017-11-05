using System;
using ServiceAPI.Dal;

namespace ServiceAPI
{
    // Test class. This class is used by ServiceApiController to populate the database used by the web application. 
    // User must tell explicitly to this app if he wants to populate or not the database when it is going to be created.
    class Test
    {
        public void TestAPIcontroller()
        {
            using (var context = new GymDbContext())
            {
                // Training Room 
                TrainingRoom tr1 = new TrainingRoom()
                {
                    Name = "Main room",
                };

                context.TrainingRooms.Add(tr1);

                // Classes
                Class c1 = new Class()
                {
                    Name = "Powerlifting",
                    Description = "Powerlifting class",
                    TimeTable = "From Monday to Friday 17-22. Sunday 16-21",
                    TrainingRoomName = "Main room",
                };

                Class c2 = new Class()
                {
                    Name = "Weightlifting",
                    Description = "Weightlifting class",
                    TimeTable = "From Monday to Friday 8-14. Sunday 9-13",
                    TrainingRoomName = "Main room",
                };

                Class c3 = new Class()
                {
                    Name = "Bodybuilding",
                    Description = "Bodybuilding class",
                    TimeTable = "Monday, Wednesday and Friday 8-14. Tuesday, Thursday and Sunday 17-21",
                    TrainingRoomName = "Main room",
                };

                Class c4 = new Class()
                {
                    Name = "Crossfit",
                    Description = "Crossfit class",
                    TimeTable = "Monday, Wednesday and Friday 17-22. Tuesday, Thursday and Sunday 9-13.",
                    TrainingRoomName = "Main room",
                };

                context.Classes.Add(c1);
                context.Classes.Add(c2);
                context.Classes.Add(c3);
                context.Classes.Add(c4);

                // TrainingPrograms
                for (int i = 0; i < 4; i++)
                {
                    TrainingProgram tp = new TrainingProgram()
                    {
                        Id = i + 1,
                        Description = "Example " + (i + 1),
                    };
                    context.TrainingPrograms.Add(tp);
                }

                // Users
                User u1 = new User()
                {
                    Name = "Alessandro",
                    Surname = "Messina",
                    Address = "Via strada 4",
                    FC = "MSSLSN95C06D912E",
                    TrainingProgramId = 1,
                };

                User u2 = new User()
                {
                    Name = "Dwayne",
                    Surname = "Johnson",
                    Address = "Via delle montagne",
                    FC = "JHNDYN72E02H501L",
                    TrainingProgramId = 1,
                };

                User u3 = new User()
                {
                    Name = "Alberto",
                    Surname = "Angela",
                    Address = "Via delle Rose",
                    FC = "NGLLRT50E01A001N",
                    TrainingProgramId = 2,
                };

                User u4 = new User()
                {
                    Name = "Piero",
                    Surname = "Angela",
                    Address = "Via degli ulivi",
                    FC = "NGLPRI87D17A026A",
                    TrainingProgramId = 2,
                };

                User u5 = new User()
                {
                    Name = "Luke",
                    Surname = "Skywalker",
                    Address = "Via degli delle stelle",
                    FC = "SKYLKU70H30C351B",
                    TrainingProgramId = 3,
                };

                User u6 = new User()
                {
                    Name = "Han",
                    Surname = "Solo",
                    Address = "Via degli delle falconi",
                    FC = "SLOHNA64A12G273I",
                    TrainingProgramId = 3,
                };

                User u7 = new User()
                {
                    Name = "Diana",
                    Surname = "Prince",
                    Address = "Via degli delle amazzoni",
                    FC = "PRNDNI87R41A001G",
                    TrainingProgramId = 4,
                };

                context.Users.Add(u1);
                context.Users.Add(u2);
                context.Users.Add(u3);
                context.Users.Add(u4);
                context.Users.Add(u5);
                context.Users.Add(u6);
                context.Users.Add(u7);

                // Memberships
                Membership m1 = new Membership()
                {
                    ClassName = "Powerlifting",
                    UserFC = "MSSLSN95C06D912E",
                };

                Membership m2 = new Membership()
                {
                    ClassName = "Powerlifting",
                    UserFC = "JHNDYN72E02H501L",
                };

                Membership m3 = new Membership()
                {
                    ClassName = "Weightlifting",
                    UserFC = "NGLLRT50E01A001N",
                };

                Membership m4 = new Membership()
                {
                    ClassName = "Weightlifting",
                    UserFC = "NGLPRI87D17A026A",
                };

                Membership m5 = new Membership()
                {
                    ClassName = "Bodybuilding",
                    UserFC = "SKYLKU70H30C351B",
                };

                Membership m6 = new Membership()
                {
                    ClassName = "Bodybuilding",
                    UserFC = "SLOHNA64A12G273I",
                };

                Membership m7 = new Membership()
                {
                    ClassName = "Crossfit",
                    UserFC = "PRNDNI87R41A001G",
                };

                context.Memberships.Add(m1);
                context.Memberships.Add(m2);
                context.Memberships.Add(m3);
                context.Memberships.Add(m4);
                context.Memberships.Add(m5);
                context.Memberships.Add(m6);
                context.Memberships.Add(m7);

                // WorkoutEquipments
                WorkoutEquipment we1 = new WorkoutEquipment()
                {
                    Name = "Barbell",
                    Purpose = "Standard equipment to perform exercises",
                    TrainingRoomName = "Main room",
                };

                WorkoutEquipment we2 = new WorkoutEquipment()
                {
                    Name = "Dumbbells",
                    Purpose = "Standard equipment to perform exercises",
                    TrainingRoomName = "Main room",
                };

                WorkoutEquipment we3 = new WorkoutEquipment()
                {
                    Name = "Flat bench",
                    Purpose = "Equipment to perform bench press, french press and others",
                    TrainingRoomName = "Main room",
                };

                WorkoutEquipment we4 = new WorkoutEquipment()
                {
                    Name = "Fitness mat",
                    Purpose = "ABS",
                    TrainingRoomName = "Main room",
                };

                WorkoutEquipment we5 = new WorkoutEquipment()
                {
                    Name = "Plates",
                    Purpose = "Add weights on burbells or dumbbells",
                    TrainingRoomName = "Main room",
                };

                WorkoutEquipment we6 = new WorkoutEquipment()
                {
                    Name = "Calf machine",
                    Purpose = "Calf",
                    TrainingRoomName = "Main room",
                };

                WorkoutEquipment we7 = new WorkoutEquipment()
                {
                    Name = "Decline bench",
                    Purpose = "ABS, declined exercises",
                    TrainingRoomName = "Main room",
                };

                WorkoutEquipment we8 = new WorkoutEquipment()
                {
                    Name = "Power rack",
                    Purpose = "Base station to perform exercises",
                    TrainingRoomName = "Main room",
                };

                WorkoutEquipment we9 = new WorkoutEquipment()
                {
                    Name = "Power tower",
                    Purpose = "pull ups and dips",
                    TrainingRoomName = "Main room",
                };

                WorkoutEquipment we10 = new WorkoutEquipment()
                {
                    Name = "Smith machine",
                    Purpose = "Guidated exercises",
                    TrainingRoomName = "Main room",
                };

                context.WorkoutEquipments.Add(we1);
                context.WorkoutEquipments.Add(we2);
                context.WorkoutEquipments.Add(we3);
                context.WorkoutEquipments.Add(we4);
                context.WorkoutEquipments.Add(we5);
                context.WorkoutEquipments.Add(we6);
                context.WorkoutEquipments.Add(we7);
                context.WorkoutEquipments.Add(we8);
                context.WorkoutEquipments.Add(we9);
                context.WorkoutEquipments.Add(we10);

                // Trainers
                Trainer t1 = new Trainer()
                {
                    Name = "Bruce",
                    Surname = "Lee",
                    Address = "Via della forza",
                    FC = "LEEBRC80A01H501Q",
                    Workshift = "Monday, Wednesday and Friday 17-22. Tuesday, Thursday and Sunday 9-13.",
                };

                Trainer t2 = new Trainer()
                {
                    Name = "Arnold",
                    Surname = "Schwarzenegger",
                    Address = "Viale rapisarda",
                    FC = "SCHRLD59S01F205I",
                    Workshift = "Monday, Wednesday and Friday 8-14. Tuesday, Thursday and Sunday 17-21",
                };

                Trainer t3 = new Trainer()
                {
                    Name = "Lu",
                    Surname = "Xiaojun",
                    Address = "Viale Leopardi",
                    FC = "HMSCRS80P01A662N",
                    Workshift = "From Monday to Friday 8-14. Sunday 9-13",
                };

                Trainer t4 = new Trainer()
                {
                    Name = "Eddie",
                    Surname = "Hall",
                    Address = "Via della forza",
                    FC = "HLLDDE76T30F158M",
                    Workshift = "From Monday to Friday 17-22. Sunday 16-21",
                };

                context.Trainers.Add(t1);
                context.Trainers.Add(t2);
                context.Trainers.Add(t3);
                context.Trainers.Add(t4);

                // Trainings
                Training trn1 = new Training()
                {
                    ClassName = "Crossfit",
                    TrainerFC = "LEEBRC80A01H501Q",
                };

                Training trn2 = new Training()
                {
                    ClassName = "Bodybuilding",
                    TrainerFC = "SCHRLD59S01F205I",
                };

                Training trn3 = new Training()
                {
                    ClassName = "Weightlifting",
                    TrainerFC = "HMSCRS80P01A662N",
                };

                Training trn4 = new Training()
                {
                    ClassName = "Powerlifting",
                    TrainerFC = "HLLDDE76T30F158M",
                };

                context.Trainings.Add(trn1);
                context.Trainings.Add(trn2);
                context.Trainings.Add(trn3);
                context.Trainings.Add(trn4);


                context.SaveChanges();

            } 
        }
        
    }
}

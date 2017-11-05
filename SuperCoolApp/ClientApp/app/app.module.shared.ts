import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { TrainingRoomsComponent } from './components/trainingRooms/trainingRooms.component';
import { WorkoutEquipmentsComponent } from './components/workoutEquipments/workoutEquipments.component';
import { TrainingProgramsComponent } from './components/trainingPrograms/trainingPrograms.component';
import { ClassesComponent } from './components/classes/classes.component';
import { UsersComponent } from './components/users/users.component';
import { TrainersComponent } from './components/trainers/trainers.component';
import { FilterPipe } from './components/searchPipe';
import { OrderByPipe } from './components/orderPipe';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        FilterPipe,
        OrderByPipe,
        HomeComponent,
        TrainingRoomsComponent,
        WorkoutEquipmentsComponent,
        TrainingProgramsComponent,
        ClassesComponent,
        UsersComponent,
        TrainersComponent,
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'trainingRooms', component: TrainingRoomsComponent },
            { path: 'workoutEquipments', component: WorkoutEquipmentsComponent },
            { path: 'trainingPrograms', component: TrainingProgramsComponent },
            { path: 'classes', component: ClassesComponent },
            { path: 'users', component: UsersComponent },
            { path: 'trainers', component: TrainersComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}

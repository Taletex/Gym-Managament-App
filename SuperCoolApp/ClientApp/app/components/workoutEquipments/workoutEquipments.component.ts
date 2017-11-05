import { Component, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

import { FilterPipe } from '../searchPipe';
import { OrderByPipe } from '../orderPipe';
import { TrainingRoomsComponent } from '../trainingRooms/trainingRooms.component';

@Component({
    selector: 'workoutEquipments',
    templateUrl: './workoutEquipments.component.html',
    styleUrls: ['./workoutEquipments.component.css'],
})
export class WorkoutEquipmentsComponent {
    public workoutEquipments: WorkoutEquipment[];
    public selectedWorkoutEquipment: WorkoutEquipment | undefined;
    public hide: boolean;
    public isUpdate: boolean;
    public searchableList: any;     
    public queryString: any;
    public isDesc: boolean;
    public column: string;
    public direction: number;
    public trainingRoomNames: string[];

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
        this.hide = true;
        this.isUpdate = false;
        this.searchableList = ['name', 'purpose', 'trainingRoomName'];
        this.isDesc = false;
        this.column = "";
        
        this.refreshData();
    }

    async refreshData() {

        this.http.get(this.baseUrl + 'api/trainingrooms').subscribe(result => {
            let tRoomNamesList = [];

            for (let tRoom of result.json() as TrainingRoom[]) {
                tRoomNamesList.push(tRoom.name);
            }

            this.trainingRoomNames = tRoomNamesList;
        }, error => console.error(error));

        this.http.get(this.baseUrl + 'api/workoutequipments').subscribe(result => {
            let workoutEquipmentList = [];

            for (let wEquipment of result.json() as WorkoutEquipment[]) {
                
                let workoutEquipment = new WorkoutEquipment();
                workoutEquipment.name = wEquipment.name;
                workoutEquipment.purpose = wEquipment.purpose;
                workoutEquipment.trainingRoomName = wEquipment.trainingRoomName;
                workoutEquipment.hasChanges = false;
                workoutEquipmentList.push(workoutEquipment);
            }

            console.log("ok");

            this.workoutEquipments = workoutEquipmentList;
            
        }, error => console.error(error));
    }

    async putData(): Promise<void> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let serverCalls = [];

        for (let workoutEquipment of this.workoutEquipments) {
            if (workoutEquipment.hasChanges == true || workoutEquipment.deleted || workoutEquipment.updated) {

                let json = JSON.stringify(workoutEquipment.toJSON());

                if (workoutEquipment.name != "") { 
                    if (!workoutEquipment.deleted) {
                        if (workoutEquipment.updated) {   
                            let call = this.http.post(this.baseUrl + 'api/workoutequipments', json, { headers: headers });
                            serverCalls.push(call);
                        } else {
                            let call = this.http.put(this.baseUrl + 'api/workoutequipments', json, { headers: headers });
                            serverCalls.push(call);
                        }
                    }
                    else {
                        let url = this.baseUrl + 'api/workoutequipments?name=' + workoutEquipment.name;
                        let call = this.http.delete(url, { headers: headers });
                        serverCalls.push(call);
                    }

                }
            }
        }
        Observable.forkJoin(serverCalls)
            .subscribe(data => {
                this.refreshData();
            }, error => console.error(error));


    }

    onSelect(workoutEquipment: WorkoutEquipment): void {

        if (workoutEquipment.deleted == false) {
            this.selectedWorkoutEquipment = workoutEquipment;
        }
    }

    addNewWorkoutEquipment(): void {
        this.hide = false;
        this.isUpdate = false;
        this.selectedWorkoutEquipment = new WorkoutEquipment();
        this.selectedWorkoutEquipment.hasChanges = true;
        this.workoutEquipments.push(this.selectedWorkoutEquipment);
    }

    async saveChanges(): Promise<void> {
        await this.putData();
        this.hide = true;
    }

    delete(workoutEquipment: WorkoutEquipment): void {
        workoutEquipment.deleted = true;
        if (workoutEquipment == this.selectedWorkoutEquipment) {
            this.hide = true;
        }
    }

    showUpdateCreateDiv(wEquipment: WorkoutEquipment): void {
        wEquipment.updated = true;
        this.hide = false;
        this.isUpdate = true;
        this.onSelect(wEquipment);
    }
    
    sort(property:any) {
        this.isDesc = !this.isDesc; 
        this.column = property;
        this.direction = this.isDesc ? 1 : -1;
    }
    
}

class WorkoutEquipment {
    private _name: string = "";
    private _purpose: string = "";
    private _trainingRoomName: string = "";
    public hasChanges: boolean;
    public deleted: boolean = false;
    public updated: boolean = false;

    get name(): string {
        return this._name;
    }
    set name(n: string) {
        this._name = n;
        this.hasChanges = true;
        console.log("set name");
    }

    get purpose(): string {
        return this._purpose;
    }
    set purpose(n: string) {
        this._purpose = n;
        this.hasChanges = true;
        console.log("set purpose");
    }
    
    get trainingRoomName(): string {
        return this._trainingRoomName;
    }
    set trainingRoomName(n: string) {
        this._trainingRoomName = n;
        this.hasChanges = true;
        console.log("set training room");
    }

    
    public toJSON() {
        return {
            name: this.name,
            purpose: this.purpose,
            trainingRoomName: this.trainingRoomName,
        };
    };
}

class TrainingRoom {
    private _name: string = "";
    public hasChanges: boolean;
    public deleted: boolean = false;
    public update: boolean = false;

    get name(): string {
        return this._name;
    }
    set name(n: string) {
        this._name = n;
        this.hasChanges = true;
        console.log("set name");
    }

    public toJSON() {
        return {
            name: this.name,
        };
    };
}

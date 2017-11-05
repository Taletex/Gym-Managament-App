import { Component, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

import { FilterPipe } from '../searchPipe';
import { OrderByPipe } from '../orderPipe';

@Component({
    selector: 'trainingRooms',
    templateUrl: './trainingRooms.component.html',
    styleUrls: ['./trainingRooms.component.css'],
})
export class TrainingRoomsComponent {
    public trainingRooms: TrainingRoom[];
    public selectedTrainingRoom: TrainingRoom | undefined;
    public hide: boolean;
    public isUpdate: boolean;
    public searchableList: any;     
    public queryString: any;
    public isDesc: boolean;
    public column: string;
    public direction: number;

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
        this.hide = true;
        this.isUpdate = false;
        this.searchableList = ['name'];
        this.isDesc = false;
        this.column = "";
        this.refreshData();
    }

    async refreshData() {

        this.http.get(this.baseUrl + 'api/trainingrooms').subscribe(result => {
            let trainingRoomList = [];

            for (let tRoom of result.json() as TrainingRoom[]) {
                
                let trainingRoom = new TrainingRoom();
                trainingRoom.name = tRoom.name;
                trainingRoom.hasChanges = false;
                trainingRoomList.push(trainingRoom);
            }

            console.log("ok");

            this.trainingRooms = trainingRoomList;
            
            
        }, error => console.error(error));
    }

    async putData(): Promise<void> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let serverCalls = [];

        for (let trainingroom of this.trainingRooms) {
            if (trainingroom.hasChanges == true || trainingroom.deleted || trainingroom.updated) {

                let json = JSON.stringify(trainingroom.toJSON());

                if (trainingroom.name != "") {
                    if (!trainingroom.deleted) {
                        if (trainingroom.updated) {
                            let call = this.http.post(this.baseUrl + 'api/trainingrooms', json, { headers: headers });
                            serverCalls.push(call);
                        } else {
                            let call = this.http.put(this.baseUrl + 'api/trainingrooms', json, { headers: headers });
                            serverCalls.push(call);
                        }
                    }
                    else {
                        let url = this.baseUrl + 'api/trainingrooms?name=' + trainingroom.name;
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

    onSelect(trainingRoom: TrainingRoom): void {

        if (trainingRoom.deleted == false) {
            this.selectedTrainingRoom = trainingRoom;
        }
    }

    addNewTrainingRoom(): void {
        this.hide = false;
        this.isUpdate = false;
        this.selectedTrainingRoom = new TrainingRoom();
        this.selectedTrainingRoom.hasChanges = true;
        this.trainingRooms.push(this.selectedTrainingRoom);
    }

    async saveChanges(): Promise<void> {
        await this.putData();
        this.hide = true;
    }

    delete(trainingRoom: TrainingRoom): void {
        trainingRoom.deleted = true;
        if (trainingRoom == this.selectedTrainingRoom) {
            this.hide = true;
        }
    }

    showUpdateCreateDiv(tRoom: TrainingRoom): void {
        tRoom.updated = true;
        this.hide = false;
        this.isUpdate = true;
        this.onSelect(tRoom);
    }
    
    sort(property:any) {
        this.isDesc = !this.isDesc;   
        this.column = property;
        this.direction = this.isDesc ? 1 : -1;
    }
    
}

class TrainingRoom {
    private _name: string = "";
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
    
    public toJSON() {
        return {
            name: this.name,
        };
    };
}

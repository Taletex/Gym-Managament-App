import { Component, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

import { FilterPipe } from '../searchPipe';     // Pipe for search (table)
import { OrderByPipe } from '../orderPipe';     // Pipe for sort (table)
import { TrainingRoomsComponent } from '../trainingRooms/trainingRooms.component';

@Component({
    selector: 'classes',
    templateUrl: './classes.component.html',
    styleUrls: ['./classes.component.css'],
})
export class ClassesComponent {
    public classes: Class[];
    public selectedClass: Class | undefined;
    public hide: boolean;           // true if user click on "update button"
    public isUpdate: boolean;       // true if user is doing an update
    public searchableList: any;     // attributes for which I can search in the table
    public queryString: any;        // search string entered by user
    public isDesc: boolean;         // true if sort direction of table's column is desc.
    public column: string;          // selected column of the table (for sorting)
    public direction: number;       // table order direction
    public trainingRoomNames: string[];

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
        this.hide = true;
        this.isUpdate = false;  
        this.searchableList = ['name', 'description', 'timeTable', 'trainingRoomName'];     
        this.isDesc = false;
        this.column = "";
        
        this.refreshData();
    }

    async refreshData() {

        // to display in the html <select> of classes.component.html all training rooms (in order to choose an existing one) 
        this.http.get(this.baseUrl + 'api/trainingrooms').subscribe(result => {
            let tRoomNamesList = [];

            for (let tRoom of result.json() as TrainingRoom[]) {
                tRoomNamesList.push(tRoom.name);
            }

            this.trainingRoomNames = tRoomNamesList;
        }, error => console.error(error));

        this.http.get(this.baseUrl + 'api/classes').subscribe(result => {
            let classList = [];

            for (let clss of result.json() as Class[]) {
                
                let _class = new Class();
                _class.name = clss.name;
                _class.description = clss.description;
                _class.timeTable = clss.timeTable;
                _class.trainingRoomName = clss.trainingRoomName;
                _class.hasChanges = false;
                classList.push(_class);
            }

            console.log("ok");

            this.classes = classList;
            
        }, error => console.error(error));
    }

    async putData(): Promise<void> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let serverCalls = [];

        for (let _class of this.classes) {
            if (_class.hasChanges == true || _class.deleted || _class.updated) {

                let json = JSON.stringify(_class.toJSON());

                if (_class.name != "") { 
                    if (!_class.deleted) {
                        if (_class.updated) {   
                            let call = this.http.post(this.baseUrl + 'api/classes', json, { headers: headers });
                            serverCalls.push(call);
                        } else {
                            let call = this.http.put(this.baseUrl + 'api/classes', json, { headers: headers });
                            serverCalls.push(call);
                        }
                    }
                    else {
                        let url = this.baseUrl + 'api/classes?name=' + _class.name;
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

    onSelect(_class: Class): void {

        if (_class.deleted == false) {
            this.selectedClass = _class;
        }
    }

    addNewClass(): void {
        this.hide = false;
        this.isUpdate = false;
        this.selectedClass = new Class();
        this.selectedClass.hasChanges = true;
        this.classes.push(this.selectedClass);
    }

    async saveChanges(): Promise<void> {
        await this.putData();
        this.hide = true;
    }

    delete(_class: Class): void {
        _class.deleted = true;
        if (_class == this.selectedClass) {
            this.hide = true;
        }
    }

    // if "update" button or "create" button was clicked, show create/update div (to collect user input) 
    showUpdateCreateDiv(clss: Class): void {
        clss.updated = true;
        this.hide = false;
        this.isUpdate = true;
        this.onSelect(clss);
    }

    // sort column
    sort(property:any) {
        this.isDesc = !this.isDesc; 
        this.column = property;
        this.direction = this.isDesc ? 1 : -1;
    }
    
}

class Class {
    private _name: string = "";
    private _description: string = "";
    private _timeTable: string = "";
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

    get description(): string {
        return this._description;
    }
    set description(n: string) {
        this._description = n;
        this.hasChanges = true;
        console.log("set description");
    }

    get timeTable(): string {
        return this._timeTable;
    }
    set timeTable(n: string) {
        this._timeTable = n;
        this.hasChanges = true;
        console.log("set timetable");
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
            description: this.description,
            timeTable: this.timeTable,
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

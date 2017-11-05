import { Component, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

import { FilterPipe } from '../searchPipe';
import { OrderByPipe } from '../orderPipe';
import { TrainingProgramsComponent } from '../trainingPrograms/trainingPrograms.component';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css'],
})
export class UsersComponent {
    public users: User[];
    public selectedUser: User | undefined;
    public hide: boolean;
    public isUpdate: boolean;
    public searchableList: any;     
    public queryString: any;
    public isDesc: boolean;
    public column: string;
    public direction: number;
    public trainingProgramId: number[];

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
        this.hide = true;
        this.isUpdate = false;
        this.searchableList = ['name', 'surname', 'address', 'fc', 'trainingProgramId'];
        this.isDesc = false;
        this.column = "";
        
        this.refreshData();
    }

    async refreshData() {

        this.http.get(this.baseUrl + 'api/trainingprograms').subscribe(result => {
            let tProgramIdsList = [];

            for (let tPrg of result.json() as TrainingProgram[]) {
                tProgramIdsList.push(tPrg.id);
            }

            this.trainingProgramId = tProgramIdsList;
        }, error => console.error(error));

        this.http.get(this.baseUrl + 'api/users').subscribe(result => {
            let userList = [];

            for (let usr of result.json() as User[]) {
                let user = new User();
                user.name = usr.name;
                user.surname = usr.surname;
                user.address = usr.address;
                user.fc = usr.fc;
                user.trainingProgramId = usr.trainingProgramId;
                user.hasChanges = false;
                userList.push(user);
            }

            console.log("ok");

            this.users = userList;
            
        }, error => console.error(error));
    }

    async putData(): Promise<void> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let serverCalls = [];

        for (let user of this.users) {
            if (user.hasChanges == true || user.deleted || user.updated) {

                let json = JSON.stringify(user.toJSON());

                if (user.fc != "") { 
                    if (!user.deleted) {
                        if (user.updated) {   
                            let call = this.http.post(this.baseUrl + 'api/users', json, { headers: headers });
                            serverCalls.push(call);
                        } else {
                            let call = this.http.put(this.baseUrl + 'api/users', json, { headers: headers });
                            serverCalls.push(call);
                        }
                    }
                    else {
                        let url = this.baseUrl + 'api/users?fc=' + user.fc;
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

    onSelect(user: User): void {

        if (user.deleted == false) {
            this.selectedUser = user;
        }
    }

    addNewUser(): void {
        this.hide = false;
        this.isUpdate = false;
        this.selectedUser = new User();
        this.selectedUser.hasChanges = true;
        this.users.push(this.selectedUser);
    }

    async saveChanges(): Promise<void> {
        await this.putData();
        this.hide = true;
    }

    delete(user: User): void {
        user.deleted = true;
        if (user == this.selectedUser) {
            this.hide = true;
        }
    }

    showUpdateCreateDiv(usr: User): void {
        usr.updated = true;
        this.hide = false;
        this.isUpdate = true;
        this.onSelect(usr);
    }
    
    sort(property:any) {
        this.isDesc = !this.isDesc; 
        this.column = property;
        this.direction = this.isDesc ? 1 : -1;
    }
    
}

class User {
    private _name: string = "";
    private _surname: string = "";
    private _address: string = "";
    private _fc: string = "";
    private _trainingProgramId: number;
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

    get surname(): string {
        return this._surname;
    }
    set surname(n: string) {
        this._surname = n;
        this.hasChanges = true;
        console.log("set surname");
    }
    
    get address(): string {
        return this._address;
    }
    set address(n: string) {
        this._address = n;
        this.hasChanges = true;
        console.log("set fc");
    }

    get fc(): string {
        return this._fc;
    }
    set fc(n: string) {
        this._fc = n;
        this.hasChanges = true;
        console.log("set fc");
    }

    get trainingProgramId(): number {
        return this._trainingProgramId;
    }
    set trainingProgramId(n: number) {
        this._trainingProgramId = n;
        this.hasChanges = true;
        console.log("set trainingProgramId");
    }
    
    public toJSON() {
        return {
            name: this.name,
            surname: this.surname,
            address: this.address,
            fc: this.fc,
            trainingProgramId: this.trainingProgramId,
        };
    };
}

class TrainingProgram {
    id: number;
    private _description: string = "";
    public hasChanges: boolean;
    public deleted: boolean = false;

    get description(): string {
        return this._description;
    }
    set description(n: string) {
        this._description = n;
        this.hasChanges = true;
        console.log("set description");
    }

    public toJSON() {
        return {
            id: this.id,
            description: this._description,
        };
    };
}
import { Component, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

import { FilterPipe } from '../searchPipe';
import { OrderByPipe } from '../orderPipe';

@Component({
    selector: 'trainers',
    templateUrl: './trainers.component.html',
    styleUrls: ['./trainers.component.css'],
})
export class TrainersComponent {
    public trainers: Trainer[];
    public selectedTrainer: Trainer | undefined;
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
        this.searchableList = ['name', 'surname', 'address', 'fc', 'workshift'];
        this.isDesc = false;
        this.column = "";
        
        this.refreshData();
    }

    async refreshData() {
        
        this.http.get(this.baseUrl + 'api/trainers').subscribe(result => {
            let trainerList = [];

            for (let trnr of result.json() as Trainer[]) {
                let trainer = new Trainer();
                trainer.name = trnr.name;
                trainer.surname = trnr.surname;
                trainer.address = trnr.address;
                trainer.fc = trnr.fc;
                trainer.workshift = trnr.workshift;
                trainer.hasChanges = false;
                trainerList.push(trainer);
            }

            console.log("ok");

            this.trainers = trainerList;
            
        }, error => console.error(error));
    }

    async putData(): Promise<void> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let serverCalls = [];

        for (let trainer of this.trainers) {
            if (trainer.hasChanges == true || trainer.deleted || trainer.updated) {

                let json = JSON.stringify(trainer.toJSON());

                if (trainer.fc != "") { 
                    if (!trainer.deleted) {
                        if (trainer.updated) {   
                            let call = this.http.post(this.baseUrl + 'api/trainers', json, { headers: headers });
                            serverCalls.push(call);
                        } else {
                            let call = this.http.put(this.baseUrl + 'api/trainers', json, { headers: headers });
                            serverCalls.push(call);
                        }
                    }
                    else {
                        let url = this.baseUrl + 'api/trainers?fc=' + trainer.fc;
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

    onSelect(trainer: Trainer): void {

        if (trainer.deleted == false) {
            this.selectedTrainer = trainer;
        }
    }

    addNewTrainer(): void {
        this.hide = false;
        this.isUpdate = false;
        this.selectedTrainer = new Trainer();
        this.selectedTrainer.hasChanges = true;
        this.trainers.push(this.selectedTrainer);
    }

    async saveChanges(): Promise<void> {
        await this.putData();
        this.hide = true;
    }

    delete(trainer: Trainer): void {
        trainer.deleted = true;
        if (trainer == this.selectedTrainer) {
            this.hide = true;
        }
    }

    showUpdateCreateDiv(trnr: Trainer): void {
        trnr.updated = true;
        this.hide = false;
        this.isUpdate = true;
        this.onSelect(trnr);
    }
    
    sort(property:any) {
        this.isDesc = !this.isDesc; 
        this.column = property;
        this.direction = this.isDesc ? 1 : -1;
    }
    
}

class Trainer {
    private _name: string = "";
    private _surname: string = "";
    private _address: string = "";
    private _fc: string = "";
    private _workshift: number;
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

    get workshift(): number {
        return this._workshift;
    }
    set workshift(n: number) {
        this._workshift = n;
        this.hasChanges = true;
        console.log("set workshift");
    }
    
    public toJSON() {
        return {
            name: this.name,
            surname: this.surname,
            address: this.address,
            fc: this.fc,
            workshift: this.workshift,
        };
    };
}
import { Component, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

import { FilterPipe } from '../searchPipe';
import { OrderByPipe } from '../orderPipe';

@Component({
    selector: 'trainingPrograms',
    templateUrl: './trainingPrograms.component.html',
    styleUrls: ['./trainingPrograms.component.css'],
})
export class TrainingProgramsComponent {
    public trainingPrograms: TrainingProgram[];
    public selectedTrainingProgram: TrainingProgram | undefined;
    public hide: boolean;
    public searchableList: any;     
    public queryString: any;
    public isDesc: boolean;
    public column: string;
    public direction: number;

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
        this.hide = true;
        this.searchableList = ['id', 'description'];
        this.isDesc = false;
        this.column = "";
        this.refreshData();
    }

    async refreshData() {
        this.http.get(this.baseUrl + 'api/trainingprograms').subscribe(result => {
            let trainingProgramList = [];

            for (let tProg of result.json() as TrainingProgram[]) {

                let trainingProgram = new TrainingProgram();
                trainingProgram.id = tProg.id;
                trainingProgram.description = tProg.description;
                trainingProgram.hasChanges = false;
                trainingProgramList.push(trainingProgram);
            }

            console.log("ok");

            this.trainingPrograms = trainingProgramList;
            
            
        }, error => console.error(error));
    }

    async putData(): Promise<void> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let serverCalls = [];

        for (let trainingProgram of this.trainingPrograms) {
            if (trainingProgram.hasChanges == true || trainingProgram.deleted) {

                let json = JSON.stringify(trainingProgram.toJSON());

                if (!trainingProgram.id) { 
                    if (!trainingProgram.deleted) {
                        let call = this.http.put(this.baseUrl + 'api/trainingprograms', json, { headers: headers });
                        serverCalls.push(call);
                    }
                }
                else {
                    if (trainingProgram.deleted) {
                        let url = this.baseUrl + 'api/trainingprograms?id=' + trainingProgram.id;
                        let call = this.http.delete(url, { headers: headers });
                        serverCalls.push(call);
                    }
                    else {
                        let call = this.http.post(this.baseUrl + 'api/trainingprograms', json, { headers: headers });
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

    onSelect(trainingProgram: TrainingProgram): void {

        if (trainingProgram.deleted == false) {
            this.selectedTrainingProgram = trainingProgram;
        }
    }

    addNewTrainingProgram(): void {
        this.hide = false;
        this.selectedTrainingProgram = new TrainingProgram();
        this.selectedTrainingProgram.hasChanges = true;
        this.trainingPrograms.push(this.selectedTrainingProgram);
    }

    async saveChanges(): Promise<void> {
        await this.putData();
        this.hide = true;
    }

    delete(trainingProgram: TrainingProgram): void {
        trainingProgram.deleted = true;
        if (trainingProgram == this.selectedTrainingProgram) {
            this.hide = true;
        }
    }

    showUpdateCreateDiv(tProgram: TrainingProgram): void {
        this.hide = false;
        this.onSelect(tProgram);
    }
    
    sort(property:any) {
        this.isDesc = !this.isDesc; //change the direction    
        this.column = property;
        this.direction = this.isDesc ? 1 : -1;
    }
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

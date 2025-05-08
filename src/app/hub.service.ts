import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { HubConnection } from '@microsoft/signalr';
import { environment } from '../environments/environment';
import { GroupedSubmission } from './grouped-submission';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  private _data = new Subject<GroupedSubmission[]>;
  private connection:HubConnection;

  constructor() { 
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(environment.hubURL)
    .build();

    this.connect();
  }

  private connect(){
    this.connection.start().catch(e => console.log(e));
    this.connection.on("updatedData", (data: GroupedSubmission[]) =>{
      this._data.next(data);
    })
  }

  public getData(): Observable <GroupedSubmission[]> {
    return this._data.asObservable();
  }

  public disconnect() {
    this.connection.stop();
  }
}

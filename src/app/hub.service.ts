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
  private connected: boolean = false;

  constructor() { 
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(environment.hubURL)
    .build();
  }

  public async connect(){
    if (this.connection.state === signalR.HubConnectionState.Disconnected){
      try{
        await this.connection.start();
        console.log("Connected Successfully");

        if (!this.connected){
          this.connection.on("updatedData", (data: GroupedSubmission[]) =>{
            console.log("Connected");
            this._data.next(data);
          })

        this.connected = true;
        }
      }
      catch (error){
        console.error("SignalR Connection Failed:", error);
        setTimeout( () => this.connect(), 2000);
      }
    }
  }

  public getData(): Observable <GroupedSubmission[]> {
    return this._data.asObservable();
  }

  public getConnection():HubConnection{
    return this.connection;
  }

  public disconnect() {
    this.connection.stop();
  }
}

import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { HubConnection } from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { GroupedSubmission } from '../interfaces/grouped-submission';
import { Observable, Subject } from 'rxjs';

//Hub Service for SignalR Connection
@Injectable({
  providedIn: 'root'
})
export class HubService {

  //Data Subject
  private _data = new Subject<GroupedSubmission[]>;
  //Hub Connection
  private connection:HubConnection;
  //Connection Status
  private connected: boolean = false;

  constructor() { 
    //Create new Connection using HubURL
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(environment.hubURL)
    .build();
  }

  public async connect(){
    //Checks if disconnected from the hub
    if (this.connection.state === signalR.HubConnectionState.Disconnected){
      try{
        //If discconected, start the connection
        await this.connection.start();
        console.log("Connected Successfully");
        //If connection is successful
        if (!this.connected){
          //Connect to SignalR's updatedData broadcast
          this.connection.on("updatedData", (data: GroupedSubmission[]) =>{
            //Log connection
            console.log("Connected");
            //Take in updated data
            this._data.next(data);
          })
        //Update Connection Status
        this.connected = true;
        }
      }
      catch (error){
        //If connection fails
        console.error("SignalR Connection Failed:", error);
        //Try again after 2s
        setTimeout( () => this.connect(), 2000);
      }
    }
  }
  //Get Data Directly as Observable
  public getData(): Observable <GroupedSubmission[]> {
    return this._data.asObservable();
  }
  //Get Connection Directly
  public getConnection():HubConnection{
    return this.connection;
  }
  //Terminate Connection
  public disconnect() {
    this.connection.stop();
  }
}

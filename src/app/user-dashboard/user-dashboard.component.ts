import { Component, OnDestroy, OnInit } from '@angular/core';
import { Filters } from '../interfaces/filters';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FlatData } from '../interfaces/flat-data';
import { MatExpansionModule } from '@angular/material/expansion';
import { GroupedSubmission } from '../interfaces/grouped-submission';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserDataDisplayComponent } from '../user-data-display/user-data-display.component';
import * as SignalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";
import { HubService } from '../hub/hub.service';

@Component({
  selector: 'app-user-dashboard',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    UserDataDisplayComponent
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  //Calculated Value to display
  public calculation: number = 0;
  //Stores retrieved user data, sent to User Data Display Child
  userData: GroupedSubmission[] = [];

  constructor(
    private http: HttpClient,
    private hubService: HubService) { }

  ngOnInit(): void {
    //Connect to SignalR
    this.hubService.connect();

    //Use to generate calculation
    this.getFlatDataset();
    //Use to get data for user info
    this.getUserData();

    this.hubService.getData().subscribe({
      next: (res) => {
        //Notify on valid update
        console.log("Update Received");
        console.log(res)
        //Reset User Data
        this.userData = [];
        //Update User data after a slight delay
        //This prevents NG0956 error
        //setTimeout(() => { this.userData = res });
        //Use to generate calculation
        this.getFlatDataset();
        //Use to get data for user info
        this.getUserData();
      },
      error: (e) => console.log(e)
    });

  }

  //Disconnect from hub service
  ngOnDestroy(): void {
    this.hubService.disconnect();
  }

  getFlatDataset() {
    //Create filter object to send
    let filters = <Filters>{
      variableFilter: "all",
      operationFilter: "avg"
    }
    //API URL
    let url = `${environment.baseURL}api/Data/GetFlatDataset`;
    //POST request
    this.http.post<FlatData>(url, filters).subscribe({
      next: (res) => {
        this.calculation = 1;
        //Loops through flat dataset and performs calculation
        //To get the total value of the aggregated data
        Object.values(res).forEach(value => {
          this.calculation *= value;
        });
      },
      error: (e) => console.error(e)
    });
  }

  getUserData() {
    //API URL
    let url = `${environment.baseURL}api/Data/GetUserSubmissions`;
    //GET request
    this.http.get<GroupedSubmission[]>(url).subscribe({
      next: (res) => {
        //Sets User Data for the User Data Display Child Component
        this.userData = res;
      },
      error: (e) => console.error(e)
    });
  }

}


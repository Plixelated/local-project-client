import { Component, OnDestroy, OnInit } from '@angular/core';
import { Filters } from '../filters';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FilteredData } from '../filtered-data';
import { FlatData } from '../flat-data';
import { MatExpansionModule } from '@angular/material/expansion';
import { GroupedSubmission } from '../grouped-submission';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserDataDisplayComponent } from '../user-data-display/user-data-display.component';
import { RawData } from '../raw-data';
import { GroupedData } from '../grouped-data';
import * as SignalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";
import { HubService } from '../hub.service';

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
  public calculation: number = 0;
  public role = '';

  dataset: FilteredData[] = [];
  userData: GroupedSubmission[] = [];
  userSubmissions: GroupedSubmission | undefined;

  title: string = "";

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
        console.log("Update Received");
        this.userData = [];
        setTimeout(() => { this.userData = res });

        //Use to get data for user info
        this.getUserData();
        //Use to generate calculation
        this.getFlatDataset();
        //Use to get data for user info
        this.getUserData();
      },
      error: (e) => console.log(e)
    });

  }

  ngOnDestroy(): void {
    this.hubService.disconnect();
  }

  getFlatDataset() {
    //USE FOR CALCULATION
    let filters = <Filters>{
      variableFilter: "all",
      operationFilter: "avg"
    }
    let url = `${environment.baseURL}api/Data/GetFlatDataset`;
    this.http.post<FlatData>(url, filters).subscribe({
      next: (res) => {
        this.calculation = Object.values(res).reduce((acc, curr) => acc * curr, 1);
      },
      error: (e) => console.error(e)
    });
  }

  getUserData() {
    let url = `${environment.baseURL}api/Data/GetUserSubmissions`;
    this.http.get<GroupedSubmission[]>(url).subscribe({
      next: (res) => {
        this.userData = res;
        console.log(this.userData);
      },
      error: (e) => console.error(e)
    });
  }

}


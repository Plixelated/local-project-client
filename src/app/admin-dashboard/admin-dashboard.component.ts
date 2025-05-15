import { Component, OnDestroy, OnInit } from '@angular/core';
import { Filters } from '../interfaces/filters';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FilteredData } from '../interfaces/filtered-data';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataChartComponent } from '../data-chart/data-chart.component';
import { FlatData } from '../interfaces/flat-data';
import { MatExpansionModule } from '@angular/material/expansion';
import { GroupedSubmission } from '../interfaces/grouped-submission';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import * as SignalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";
import { HubService } from '../hub/hub.service';
import { UserDataDisplayComponent } from "../user-data-display/user-data-display.component";

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    ReactiveFormsModule,
    DataChartComponent,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    UserDataDisplayComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  //Internal reference to dataset
  private _dataset: FilteredData[] = [];
  //Calculated Value to display
  public calculation: number = 1;
  //Form Groups
  form!: FormGroup;
  //Shared reference to dataset, sent to Chart Component Child
  dataset: FilteredData[] = [];
  //Stores retrieved user data
  userData: GroupedSubmission[] = [];
  //Chart Component Child Title
  title: string = "";

  constructor(
    private http: HttpClient,
    private hubService: HubService
  ) { }

  ngOnInit(): void {
    //Connect to SignalR
    this.hubService.connect();

    //Set Default Values
    this.form = new FormGroup({
      variableFilter: new FormControl('r_s'),
      operationFilter: new FormControl('avg')
    })

    //Update Values on Variable Change
    this.form.get('variableFilter')?.valueChanges.subscribe(value => {
      this.getFlatDataset();
      this.getFilteredDataset();
    });
    //Update Values on Filter Change
    this.form.get('operationFilter')?.valueChanges.subscribe(value => {
      this.getFlatDataset();
      this.getFilteredDataset();
    });

    //Use to generate calculation
    this.getFlatDataset();
    //Use to get data to display
    this.getFilteredDataset();
    //Use to get data for user info
    this.getUserData();

    //Subscribes to Hub Service for SignalR
    this.hubService.getData().subscribe({
      next: (res) => {
        //Notify on valid update
        console.log("Update Received");
        console.log(res)
        //Reset User Data
        this.userData = [];
        //Update User data after a slight delay
        //This prevents NG0956 error
        setTimeout(() => { this.userData = res });

        //Use to generate calculation
        this.getFlatDataset();
        //Use to get data to display
        this.getFilteredDataset();
      },
      error: (e) => console.log(e)
    });
  }

  ngOnDestroy(): void {
    //Disconnects from hub service
    this.hubService.disconnect();
  }

  //Flat Data is used to give the calculation of the aggregated
  //values from the entire dataset
  getFlatDataset() {
    //Creates Filter Object to Pass
    let filters = <Filters>{
      variableFilter: "all",
      operationFilter: this.form.controls['operationFilter'].value
    }
    //API URL
    let url = `${environment.baseURL}api/Data/GetFlatDataset`;
    //POST Request
    this.http.post<FlatData>(url, filters).subscribe({
      next: (res) => {
        this.calculation = 1;
        //Loop through the flat data
        //Calculate the total, and if its a percent value
        //Divide by 100
        Object.entries(res).forEach(([key,value]) => {
          if (key.startsWith("f_")){
            value /= 100;
          }
          this.calculation *= value;
        });
      },
      error: (e) => console.error(e)
    });
  }

  //This gets a list of all of the raw data form the database
  getUserData() {
    //API URL
    let url = `${environment.baseURL}api/Data/GetRawData`;
    //GET request
    this.http.get<GroupedSubmission[]>(url).subscribe({
      next: (res) => {
        //Set user data to 
        this.userData = res;
      },
      error: (e) => console.error(e)
    });
  }

  //Gets Data According to the requested variable and operation filter
  getFilteredDataset() {
        //Creates Filter Object to Pass
    let filters = <Filters>{
      variableFilter: this.form.controls['variableFilter'].value,
      operationFilter: this.form.controls['operationFilter'].value
    }
    //API URL
    let url = `${environment.baseURL}api/Data/GetFilteredDataset`;
    //POST Request
    this.http.post<FilteredData[]>(url, filters).subscribe({
      next: (res) => {
        //Sets the internal dataset to the recieved object
        this._dataset = res;
        //Sets the Title used by the Chart Component Child
        this.title = filters.variableFilter.toUpperCase();
        //Sets the dataset used by the Char Component Child
        this.dataset = this._dataset;
      },
      error: (e) => console.error(e)
    });
  }

}

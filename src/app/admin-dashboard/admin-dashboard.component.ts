import { Component, OnDestroy, OnInit } from '@angular/core';
import { Filters } from './filters';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FilteredData } from '../filtered-data';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataChartComponent } from '../data-chart/data-chart.component';
import { FlatData } from '../flat-data';
import { MatExpansionModule } from '@angular/material/expansion';
import { GroupedSubmission } from '../grouped-submission';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import * as SignalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";
import { HubService } from '../hub.service';
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
  private _dataset: FilteredData[] | FilteredData[][] = [];
  public calculation: number = 0;

  form!: FormGroup;
  dataset: FilteredData[] | FilteredData[][] = [];
  userData: GroupedSubmission[] = [];

  title: string = "";

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private hubService: HubService
  ) { }

  ngOnInit(): void {
    //Set Default Values
    this.form = new FormGroup({
      variableFilter: new FormControl('r_s'),
      operationFilter: new FormControl('avg')
    })

    this.form.get('variableFilter')?.valueChanges.subscribe(value => {
      this.getFlatDataset();
      this.getFilteredDataset();
    });

    this.form.get('operationFilter')?.valueChanges.subscribe(value => {
      this.getFlatDataset();
      this.getFilteredDataset();
    });

    this.getFlatDataset();
    this.getFilteredDataset();
    this.getUserData();

    this.hubService.getData().subscribe({
      next: (res) => {
        console.log("Update Received");
        this.userData = [];
        setTimeout(() => { this.userData = res });

        this.getFilteredDataset();
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
      operationFilter: this.form.controls['operationFilter'].value
    }
    let url = `${environment.baseURL}api/Data/GetFlatDataset`;
    this.http.post<FlatData>(url, filters).subscribe({
      next: (res) => {
        this.calculation = Object.values(res).reduce((acc, curr) => acc * curr, 1);
      },
      error: (e) => console.error(e)
    });
  }

  getAllData() {
    let filters = <Filters>{
      variableFilter: this.form.controls['variableFilter'].value,
      operationFilter: this.form.controls['operationFilter'].value
    }
    let url = `${environment.baseURL}api/Data/GetAllData`;
    this.http.post<FilteredData[][]>(url, filters).subscribe({
      next: (res) => {
        this._dataset = res;
        this.title = filters.variableFilter.toUpperCase();
        this.dataset = this._dataset;
      },
      error: (e) => console.error(e)
    });
  }

  getUserData() {
    let url = `${environment.baseURL}api/Data/GetRawData`;
    this.http.get<GroupedSubmission[]>(url).subscribe({
      next: (res) => {
        this.userData = res;
      },
      error: (e) => console.error(e)
    });
  }


  getFilteredDataset() {
    let filters = <Filters>{
      variableFilter: this.form.controls['variableFilter'].value,
      operationFilter: this.form.controls['operationFilter'].value
    }
    let url = `${environment.baseURL}api/Data/GetFilteredDataset`;
    this.http.post<FilteredData[]>(url, filters).subscribe({
      next: (res) => {
        this._dataset = res;
        this.title = filters.variableFilter.toUpperCase();
        this.dataset = this._dataset;
      },
      error: (e) => console.error(e)
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { Filters } from '../filters';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FilteredData } from '../filtered-data';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataChartComponent } from '../data-chart/data-chart.component';
import { FlatData } from '../flat-data';
import { MatExpansionModule } from '@angular/material/expansion';
import { GroupedSubmission } from '../grouped-submission';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserDataDisplayComponent } from '../user-data-display/user-data-display.component';

@Component({
  selector: 'app-user-dashboard',
  imports: [
        ReactiveFormsModule,
        DataChartComponent,
        MatExpansionModule,
        MatIconModule,
        MatButtonModule,
        UserDataDisplayComponent
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  private _dataset: FilteredData[] = [];
  public calculation: number = 0;
  public role = '';

  form!: FormGroup;
  dataset: FilteredData[] = [];
  userData: GroupedSubmission[] = [];

  title: string = "";

  constructor(private http: HttpClient) { }

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
    //Use to generate calculation
    this.getFlatDataset();
    //Use to get data to display
    this.getFilteredDataset();
    //Use to get data for user info
    this.getUserData();

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


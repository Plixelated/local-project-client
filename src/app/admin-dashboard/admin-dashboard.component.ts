import { Component, OnInit } from '@angular/core';
import { Filters } from './filters';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RawData } from '../raw-data';
import { FilteredData } from '../filtered-data';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataChartComponent } from '../data-chart/data-chart.component';
import { FlatData } from '../flat-data';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    ReactiveFormsModule,
    DataChartComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private _dataset: FlatData | FilteredData[] = [];

  form!: FormGroup;
  dataset: FlatData | FilteredData[] = [];

  labels:string[]=[];
  title:string = "";

  constructor(private fb: FormBuilder, private http: HttpClient){}

  ngOnInit(): void {
    //Set Default Values
    this.form = this.fb.group({
      variableFilter: ['all'],
      operationFilter: ['avg']
    });


    this.getFlatDataset();
  }

  getFlatDataset(){
    let filters = <Filters>{
      variableFilter: this.form.controls['variableFilter'].value,
      operationFilter: this.form.controls['operationFilter'].value
    }
    let url = `${environment.baseURL}api/Data/GetFlatDataset`;
    this.http.post<FlatData>(url, filters).subscribe({
      next:(res) =>{
        this._dataset = res;
        this.title = filters.variableFilter.toUpperCase();
        console.log(this._dataset)
        this.dataset = this._dataset;
      },
      error:(e) => console.error(e)
    });
  }
  

  getFilteredDataset(){
    let filters = <Filters>{
      variableFilter: this.form.controls['variableFilter'].value,
      operationFilter: this.form.controls['operationFilter'].value
    }
    let url = `${environment.baseURL}api/Data/GetFilteredDataset`;
    this.http.post<FilteredData[]>(url, filters).subscribe({
      next:(res) =>{
        this._dataset = res;
        console.log(this._dataset)
        this.title = filters.variableFilter.toUpperCase();
      },
      error:(e) => console.error(e)
    });
  }
}

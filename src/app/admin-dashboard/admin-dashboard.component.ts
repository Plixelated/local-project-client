import { Component, OnInit } from '@angular/core';
import { Filters } from './filters';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RawData } from '../raw-data';
import { FilteredData } from '../filtered-data';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  private _dataset: FilteredData[] | FilteredData[][] = [];
  public calculation:number = 0;

  form!: FormGroup;
  dataset: FilteredData[] | FilteredData[][] = [];

  title:string = "";

  constructor(private fb: FormBuilder, private http: HttpClient){}

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
  }


  getFlatDataset(){
    //USE FOR CALCULATION
    let filters = <Filters>{
      variableFilter: "all",
      operationFilter: this.form.controls['operationFilter'].value
    }
    let url = `${environment.baseURL}api/Data/GetFlatDataset`;
    this.http.post<FlatData>(url, filters).subscribe({
      next:(res) =>{
        console.log(res);
        this.calculation = Object.values(res).reduce((acc,curr) => acc * curr, 1);
        console.log(this.calculation)
      },
      error:(e) => console.error(e)
    });
  }

  getAllData(){
    let filters = <Filters>{
      variableFilter: this.form.controls['variableFilter'].value,
      operationFilter: this.form.controls['operationFilter'].value
    }
    let url = `${environment.baseURL}api/Data/GetAllData`;
    this.http.post<FilteredData[][]>(url, filters).subscribe({
      next:(res) =>{
        this._dataset = res;
        this.title = filters.variableFilter.toUpperCase();
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
        this.dataset = this._dataset;
      },
      error:(e) => console.error(e)
    });
  }
}

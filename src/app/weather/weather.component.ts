import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { WeatherForecast } from '../weather-forecast';
//Generated via `ng generate component weather`
@Component({
  selector: 'app-weather',
  imports: [],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent {
  public forecasts: WeatherForecast[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getForecasts();
  }

  getForecasts() {
    this.http.get<WeatherForecast[]>(`${environment.baseURL}weatherforecast`).subscribe({
      next:(result) => {
        this.forecasts = result
      },
      error:(e) => console.error(e)
    }
    );
  }
}
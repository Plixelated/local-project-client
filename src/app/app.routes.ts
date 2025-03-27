import { Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { CitiesComponent } from './cities/cities.component';
import { CountriesComponent } from './countries/countries.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

//Maps Paths to the code found in the generated components
export const routes: Routes = [
    {
        path:"weather",
        component:WeatherComponent
    },
    {   path:"cities", 
        component:CitiesComponent
    },
    {    path:"countries",
        component:CountriesComponent
    },
    {
        path:"navbar",
        component:NavBarComponent
    },
    {
        path:"",
        component:WeatherComponent,
        pathMatch: "full"
    }

];
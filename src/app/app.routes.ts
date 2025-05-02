import { Routes } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LoginComponent } from './auth/login.component';
import { AppComponent } from './app.component';
import { InputWrapperComponent } from './input-wrapper/input-wrapper.component';
import { RegisterComponent } from './auth/register.component';

//Maps Paths to the code found in the generated components
export const routes: Routes = [
    {
        path:"navbar",
        component:NavBarComponent
    },
    {
        path:"login",
        component:LoginComponent
    },
    {
        path:"register",
        component:RegisterComponent
    },
    {
        path:"",
        component:InputWrapperComponent,
        pathMatch: "full"
    }

];
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seed-data',
  imports: [ FormsModule,],
  templateUrl: './seed-data.component.html',
  styleUrl: './seed-data.component.scss'
})
export class SeedDataComponent {

  seedQty: number = 0;

  constructor(private http: HttpClient) { }

  //Seeds Data when logged in as an admin
  //For Use when Deployed and no access to Swagger
  
  seedRoles() {
    let url = `${environment.baseURL}api/Seed/roles`;
    this.http.post(url, {}).subscribe({
      next: (res) => console.log(res),
      error: (e) => console.error(e)
    });
  }
  seedAdminClaims() {
    let url = `${environment.baseURL}api/Seed/AdminClaims`;
    this.http.post(url, {}).subscribe({
      next: (res) => console.log(res),
      error: (e) => console.error(e)
    });
  }

  seedResearcherClaims() {
    let url = `${environment.baseURL}api/Seed/ResearcherClaims`;
    this.http.post(url, {}).subscribe({
      next: (res) => console.log(res),
      error: (e) => console.error(e)
    });
  }

  seedUserClaims() {
    let url = `${environment.baseURL}api/Seed/UserClaims`;
    this.http.post(url, {}).subscribe({
      next: (res) => console.log(res),
      error: (e) => console.error(e)
    });
  }

  seedData(){
    let url = `${environment.baseURL}api/Seed/RandomData/${this.seedQty}`;
    this.http.post(url, {}).subscribe({
      next: (res) => console.log(res),
      error: (e) => console.error(e)
    });
  }


}

import { Injectable } from '@angular/core';
import { LoginRequest } from './login-request';
import { LoginResponse } from './login-response';
import { BehaviorSubject, Observable, pipe, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from './register-request';
import { RegisterResponse } from './register-response';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //Create Subject for authStatus
  private _authStatus = new BehaviorSubject<boolean>(false);
  //Makes authStatus an observable
  authStatus = this._authStatus.asObservable();
  //DI
  constructor(private http: HttpClient) { }
  //Login Observable
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    //API URL
    let url = `${environment.baseURL}api/Admin/Login`;
    //POST Request
    return this.http.post<LoginResponse>(url, loginRequest, { withCredentials: true })
      .pipe(tap(res => { //Pipe the response
        //If successful
        if (res.success) {
          //Store token
          localStorage.setItem("project_token", res.token);
          //Set Auth Status as True
          this.setAuthStatus(true);
        }
      }));
  }
  //Toggles Auth Status
  private setAuthStatus(status: boolean) {
    this._authStatus.next(status);
  }
  //Log User Out from client and server
  logout() {
    //POST Request for logout
    //Deletes the cookie
    //Maybe Pipe this instead?
    return this.http.post(`${environment.baseURL}api/Admin/Logout`, {}, { withCredentials: true }).subscribe({
      next: (res => {
        //If successful
        if (res) {
          //Remove token from storage
          localStorage.removeItem("project_token");
          //Toggle Auth Status
          this.setAuthStatus(false);
        }
      }),
      error: (e) => console.error(e)
    })
  }
  //Checks if user is authenticated
  isAuthenticated(): boolean {
    return localStorage.getItem("project_token") != null;
  }
  //Register User
  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    //API URL
    let url = `${environment.baseURL}api/Admin/Register`;
    //POST request
    return this.http.post<RegisterResponse>(url, registerRequest, { withCredentials: true })
      .pipe(tap(res => {
        //if successful
        if (res.success) {
          //Show Result
          console.log(res)
        }
      }));
  }
  //Register as Admin
  //Allows registration of admin account
  //Currently not utilized
  registerAdmin(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    let url = `${environment.baseURL}api/Admin/RegisterAdmin`;
    return this.http.post<RegisterResponse>(url, registerRequest, { withCredentials: true })
      .pipe(tap(res => {
        //if successful
        if (res.success) {
          //Show Result
          console.log(res)
        }
      }));

  }

}

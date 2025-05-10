import { Injectable } from '@angular/core';
import { LoginRequest } from './login-request';
import { LoginResponse } from './login-response';
import { BehaviorSubject, Observable, pipe, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from './register-request';
import { RegisterResponse } from './register-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authStatus = new BehaviorSubject<boolean>(false);
  authStatus = this._authStatus.asObservable();

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {

    let url = `${environment.baseURL}api/Admin/Login`;

    return this.http.post<LoginResponse>(url, loginRequest, {withCredentials : true})
      .pipe(tap(res => {

        if (res.success) {
          localStorage.setItem("project_token", res.token);
          this.setAuthStatus(true);
        }

      }));

  }

  private setAuthStatus(status: boolean) {
    this._authStatus.next(status);
  }

  logout() {
    return this.http.post(`${environment.baseURL}api/Admin/Logout`,{},{withCredentials:true}).subscribe({
      next: (res =>{
        if(res){
          localStorage.removeItem("project_token");
          this.setAuthStatus(false);
        }
      }),
      error: (e) => console.error(e)
    })
  }

  isAuthenticated():boolean{
    return localStorage.getItem("project_token") != null;
  }

  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {

    let url = `${environment.baseURL}api/Admin/Register`;

    return this.http.post<RegisterResponse>(url, registerRequest, {withCredentials : true})
      .pipe(tap(res => {
        if (res.success) {
          console.log(res)
        }

      }));

  }

  registerAdmin(registerRequest: RegisterRequest): Observable<RegisterResponse> {

    let url = `${environment.baseURL}api/Admin/RegisterAdmin`;

    return this.http.post<RegisterResponse>(url, registerRequest, { withCredentials: true })
      .pipe(tap(res => {

        if (res.success) {
          console.log(res)
        }

      }));

  }

}

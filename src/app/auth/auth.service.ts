import { Injectable } from '@angular/core';
import { LoginRequest } from './login-request';
import { LoginResponse } from './login-response';
import { BehaviorSubject, Observable, pipe, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authStatus = new BehaviorSubject<boolean>(false);
  authStatus = this._authStatus.asObservable();

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse>{

    let url = `${environment.baseURL}api/Admin/Login`;

    return this.http.post<LoginResponse>(url,loginRequest, {withCredentials : true})
    .pipe(tap(res => {
      
      if (res.success){
        this.setAuthStatus(true);
      }

    }));

  }

  private setAuthStatus(status:boolean){
    this._authStatus.next(status);
  }

  logout(){
    return this.http.post(`${environment.baseURL}api/Admin/Logout`,{},{withCredentials:true}).subscribe({
      next: (res =>{
        if(res){
          this.setAuthStatus(false);
        }
      }),
      error: (e) => console.error(e)
    })
  }
  
}

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

//Will intercept every requestion and send with credentials
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const userToken = localStorage.getItem("project_token");
  const modifiedRequest = req.clone({
    //Using a hybrid solution
    //Send HTTP Only Cookie
    withCredentials:true,
    //Sends Token with Header
    setHeaders: {
      Authorization: `Bearer ${userToken}`
    }
  });
  return next(modifiedRequest).pipe(
    catchError(e => {
      //Intercepts 401 error and redirects to login page
      if (e instanceof HttpErrorResponse && e.status === 401) {
        router.navigate(["/login"]);
      }
      return throwError(() => e);
    })); //Pipe results of next
};
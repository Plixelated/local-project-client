import { HttpInterceptorFn } from '@angular/common/http';

//Will intercept every requestion and send with credentials
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const modifiedRequest = req.clone({
      withCredentials:true
    });

    return next(modifiedRequest);
};
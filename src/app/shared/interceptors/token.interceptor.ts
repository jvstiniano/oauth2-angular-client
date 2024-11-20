import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { environment } from '../../environment/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  authService = inject(AuthService);
  router = inject(Router);

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = request;
    let finished = false;
      setTimeout(() => {
        if (!finished) {
          //this.loaderService.show();
        }
      }, 500);
    const token = this.authService.getSavedToken();
    if(token != null && request.url.includes(environment.auth.pattern_url_api)) {
      authReq = request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)});
      return next.handle(authReq).pipe(
        catchError(e => {
          if (e.status === 401) {
            if (this.authService.isAuthenticated()) {
              this.authService.logout();
            }
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Información',
              text: `No está auntenticado o caducó su sesión, ¡Inicie sesión!`,
              showConfirmButton: false,
              timer: 3000
            });
            this.router.navigate(['/welcome']);
          }
          if (e.status === 403) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Acceso denegado',
              text: `Sin acceso al recurso!`
            });
            this.router.navigate(['/welcome']);
          }
          if (e.status === 0) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error de conexión',
              text: `Ups! problemas con el webservice o tu conexión a internet`
            });
          }
          return throwError(()=>new Error('error '+e.error));
        }),
        finalize(() => {
          finished = true;
          //this.loaderService.hide();
        })
      );
    }else {
      return next.handle(request).pipe(
        finalize(() => {
          finished = true;
          //this.loaderService.hide();
        })
      );
    }
    
  }
};

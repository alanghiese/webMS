import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// import { Events } from 'ionic-angular';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// import { EVT_SESSION_EXPIRED } from '../../constants';
import { JSONResponse } from '../interfaces';

import { Router } from '@angular/router';

@Injectable()
export class dbPetitionsInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
       
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        let resp = event;
        if (event instanceof HttpResponse) {
          resp = event as HttpResponse<JSONResponse>;
          if (resp.body.error) {
            // si la respuesta JSON contiene el campo 'error'
            if (resp.body.error.message.includes('logearse')) {
              /* La sesión expiró o no es válida, genera evento.
               * En lugar de comparar el string del mensaje, lo mejor sería
               * setear el status de la respuesta como 403 Unauthorized */
              // this.events.publish(EVT_SESSION_EXPIRED);
              let url = localStorage.getItem('url');
              let user = localStorage.getItem('user');
              let pass = localStorage.getItem('password');
              localStorage.clear();
              localStorage.setItem('url',url);
              localStorage.setItem('logged','false');
              localStorage.setItem('checked', 'false');
              localStorage.setItem('relog', 'false');
              localStorage.setItem('loading', 'falase');
              localStorage.setItem('user', user);
              localStorage.setItem('password', pass);
              this.router.navigate(['login']);
              console.log('session expired');
              alert('Sesion expirada, debe volver a loguearse');
            } else {
              /* Workaround ya que todas las respuestas del server tienen
               * status = 200, inclusive si es un error. Si el campo error está
               * presente en la respuesta, lanzo un error para que sea manejado
               * más arriba en la app.
               */
              throw new HttpErrorResponse({ 
                error: resp.body,
                status: 400,
                statusText: resp.body.error.message
              });
            }
          }
        }
        return resp;
      })
    );
  }

}

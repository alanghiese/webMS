import { Injectable } from '@angular/core';
import { LoginResponse, UserCredentials, JSONResponse, AppointmentQuery, Client, MedicalHistory, turnosV0, DoctorQuery } from '../interfaces';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SessionProvider } from './session'
import { of } from 'rxjs';




@Injectable()
export class DbPetitionsComponent {

  private API_URL_BASE = 'http://medisoftware.com.ar/MediwareHub';

  private API_ENDPOINTS = {
    login: 'login.php',
    connectToClient: 'conectarA.php',
    getDoctors: 'mediwareHub.php',
    getTurnsDoctors: 'mediwareHub.php',
    getStatistics: 'mediwareHub.php',
    getMedicalHistory: 'mediwarehub.php',
    searchPatient: 'mediwarehub.php',
    addMedicalHistoryEntry: 'mediwarehub.php'
  };

  constructor(public http: HttpClient, public session: SessionProvider) {}

  /**
    * Inicia sesión con las credenciales especificadas
    * @param credentials - credenciales del usuario
    */
  login(credentials: UserCredentials): Observable<LoginResponse> {
    let params = new HttpParams()
      .set("tipoLogin", "medico")                  // iniciar siempre como `medico`
      .set("idUsuario", credentials.enrollmentId)
      .set("pass", credentials.password);

    const url = `${this.API_URL_BASE}/${this.API_ENDPOINTS.login}`;
    return this.http.get<JSONResponse>(url, {params: params})
      .pipe(
        map(resp => resp.data),
        tap(resp => {
          console.log(`logged in with user id=${credentials.enrollmentId}`);
          // console.log(resp)
          this.session.setSession(resp);
          // console.log(this.session);
        }),
        catchError(this.handleAndThrow(`login id=${credentials.enrollmentId}`))
      );

  }





  /**
    * Conecta a la fuente de datos especificada
    * @param dataSource - nombre de la conexión de la fuente de datos
    */
  connectToClient(dataSource: string): Observable<any> {
    let params = new HttpParams()
      .set("cliente", dataSource);

    const url = `${this.API_URL_BASE}/${this.API_ENDPOINTS.connectToClient}`;

    return this.http.get<Client>(url, {params: params}) //JSONResponse
      .pipe(
        map(resp => resp),//.data
        tap(resp => {
          console.log(`connected to client=${dataSource}`);
          // console.log(resp);
          this.session.setActiveClient(resp);
        }),
        
        catchError(this.handleAndThrow(`connect to client=${dataSource}`))
      );
  }

  getStatic():Observable<any>{
    return this.http.get<JSONResponse>('http://medisoftware.com.ar/MediwareHub/getStatic.php')
    .pipe(
      map(resp=> {
        return resp;
      }));
  }



  getStatistics(from:Date, to: Date):Observable<any>{
    let params = new HttpParams()
      .set("accion", "getEstadisticas")
      .set("clave",'turnosV0')
      .set("desde", this._formatDate(from))
      .set("hasta", this._formatDate(to));  
    const url = `${this.API_URL_BASE}/${this.API_ENDPOINTS.getStatistics}`;
    return this.http.get<JSONResponse>(url, {params: params})
    .pipe(
      map(resp=> {
        return resp;
      }));
  }


  getActualStatistics():Observable<any>{
    let params = new HttpParams()
      .set("accion", "getEstadisticas")
      .set("clave",'turnosV0')
      .set("desde", '')
      .set("hasta", '');  
    const url = `${this.API_URL_BASE}/${this.API_ENDPOINTS.getStatistics}`;
    return this.http.get<JSONResponse>(url, {params: params})
    .pipe(
      map(resp=> {
        return resp;
      }));
  }


  getDoctors(value) : Observable<any> {

    let params = new HttpParams()
      .set("accion", "getJSONMedicos")
      .set("servicio", value); //value viene en blanco por defecto

    const url = `${this.API_URL_BASE}/${this.API_ENDPOINTS.getDoctors}`;
    return this.http.get<JSONResponse>(url, {params: params})
      .pipe(
        map(resp => {
          // console.log(resp);
          return resp;
        }),
        //tap(ap => console.log(`get Doctors ${params}`)),
        catchError(this.handleAndThrow(`get doctors ${params}`))
      );

  }

  getTurnsDoctors(fechaDesde: Date, fechaHasta: Date) : Observable<any> {
    //momentoDelDia (maniana|tarde|todo)
    
    let params = new HttpParams()
    .set("accion", "getJSONTurnos")
    .set("nombreMedico",'')
    .set("codigoMedico",'')
    .set("fechaDesde",this._formatDate(fechaDesde))
    .set("fechaHasta",this._formatDate(fechaHasta))
    .set("momentoDelDia",'todo'); //de momento queda en todo

    const url = `${this.API_URL_BASE}/${this.API_ENDPOINTS.getTurnsDoctors}`;
    return this.http.get<JSONResponse>(url, {params: params})
      .pipe(
        map(resp => {
          console.log(`get turn doctors ${params}`);
          return resp;
        }),
        //tap(ap => console.log(`get Doctors ${params}`)),
        catchError(this.handleAndThrow(`get turn doctors ${params}`))
      );

  }

  

  getServices() : Observable<any> {

    let params = new HttpParams()
      .set("accion", "getJSONServicios"); //value viene en blanco por defecto

    const url = `${this.API_URL_BASE}/${this.API_ENDPOINTS.getDoctors}`;
    return this.http.get<JSONResponse>(url, {params: params})
      .pipe(
        map(resp => {
          // console.log(resp);
          return resp;
        }),
        //tap(ap => console.log(`get Doctors ${params}`)),
        catchError(this.handleAndThrow(`get servicios ${params}`))
      );

  }



  

  

  
  

  /**
    * Devuelve un string con la descripción del error.
    * @param err - error
    * @param operation - nombre de la operación que falló
    */
  private prettifyError(err: any, operation='operation'): string {
      let errDetail: string;

      if (err instanceof HttpErrorResponse)
        errDetail = `with code ${err.error.error.code}: ${err.error.error.message}`;
      else
        errDetail = `${err.message}`;
      
      return `${operation} failed ${errDetail}`;
  }

  /**
    * Procesa la operación HTTP que falló y lanza un error.
    * No deja que el flujo de la aplicación continúe.
    * @param operation - nombre de la operación que falló
    */
  private handleAndThrow(operation?: string) {
    return (err: any): never => {
      let errMsg = this.prettifyError(err, operation);
      // TODO: send the error to remote logging infrastructure
      console.error(err);
      console.log(errMsg);
      throw err;
    };
  }

  

  /**
    * Devuelve un string con la fecha formateada como `YYYY-MM-DD`.
    * @param date - fecha a formatear
    */
  _formatDate(date: Date): string {
    // añade un 0 adelante cuando el numero es menor a 10
    function pad(n: number) { return n < 10 ? '0' + n : n };

    return date.getUTCFullYear() + '-'
      + pad(date.getUTCMonth() + 1) + '-'
      + pad(date.getUTCDate());
  }







  /**
    * Handle Http operation that failed and let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
  private handleAndContinue<T>(operation?: string, result?: T) {
    return (err: any): Observable<T> => {
      let errMsg = this.prettifyError(err, operation);
      // TODO: send the error to remote logging infrastructure
      console.error(err);
      console.log(errMsg);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

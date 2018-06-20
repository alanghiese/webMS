import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { falseUser } from '../models/falseUser'
import { JSONResponse } from '../interfaces'

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class DbPetitionsFalseComponent {

	private url: string;
	constructor(public http: HttpClient) {
		this.url = 'http://jsonplaceholder.typicode.com/users';
	}


	Users: Array<falseUser>;

	get(){
    return this.http.get<falseUser>(this.url)
      .pipe(
        map(resp => resp),
        tap(resp => {
          // console.log(resp.data);
         
        })
      );
	}

}
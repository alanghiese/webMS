import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Filter } from './models/filter';
import { back } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	filter: Filter;
	clients: any[];
	doctors: any[] = null;	
	services: any[] = null;
	coverages: any[]; //POR EL MOMENTO NO TENGO CON QUE SETEARLO (SERVICIO)
	now: boolean = false;
	interval; //para el intervalo de datos en el momento



	constructor(private _router: Router) {
	
		if (localStorage.getItem('checked') != null)
			back.chk = localStorage.getItem('checked');
		if (localStorage.getItem('user') != null)
			back.usr = localStorage.getItem('user');
		if (localStorage.getItem('password') != null)
			back.psw = localStorage.getItem('password');
		if (localStorage.getItem('loading') != null)
			back.loading = localStorage.getItem('loading');
		if (localStorage.getItem('logged') != null)
			back.logged = localStorage.getItem('logged');
		if (localStorage.getItem('url') != null)
			back.url = localStorage.getItem('url');

		localStorage.clear();
		// console.log(this.back.url);
		
		if (back.chk != 'true')
			back.logged = 'false';
		
	    if (back.chk == 'true' && back.logged == 'true'){
	    	
        	localStorage.setItem('logged', 'false');
        	localStorage.setItem('relog', 'true');
        	localStorage.setItem('user',back.usr);
        	localStorage.setItem('checked',back.chk);
        	localStorage.setItem('password',back.psw);
        	localStorage.setItem('url',back.url);
        	this._router.navigate(['login']);

	    }
	    else {

	    	localStorage.setItem('logged', back.logged);
        	localStorage.setItem('url',back.url);
	    }
	    this._router.navigate(['login']);

	    

	    this.filter = new Filter('','','','','','','','');
	}

	setCoverages(c:any[]){
		this.coverages = c;
	}

	getCoverages():any[]{
		if (this.coverages)
			return this.coverages;
		return [''];
	}

	setClients(c:any[]){
		this.clients = c;
	}

	getClients():any[]{
		if (this.clients)
			return this.clients;
		return [''];
	}

	setDoctors(d:any[]){
		this.doctors = d;
	}

	getDoctors():any[]{
		if (this.doctors)
			return this.doctors;
		return [''];
	}

	setServices(s:any[]){
		this.services = s;
	}

	getServices():any[]{
		if (this.services)
			return this.services;
		return [''];
	}

	getCurrentClient(){
		if (this.clients)
			return this.clients[0];
		return 'null';
	}
	

	isLogged():boolean{
		if (localStorage.getItem('logged') != null)
			back.logged = localStorage.getItem('logged');

		if (back.logged != '')
			return back.logged == 'true';
		else
			return false;


	}



	isLoading(){
		if (localStorage.getItem('loading') != null)
			back.loading = localStorage.getItem('loading');

		if (back.loading != '')
			return back.loading == 'true';
		else
			return false;
	}

}

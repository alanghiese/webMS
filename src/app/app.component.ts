import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Filter } from './models/filter';

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

	back = {
    chk: '',
    usr: '',
    psw: '',
    logged: '',
    loading: ''
  	};


	constructor(private _router: Router) {

		if (localStorage.getItem('checked') != null)
			this.back.chk = localStorage.getItem('checked');
		if (localStorage.getItem('user') != null)
			this.back.usr = localStorage.getItem('user');
		if (localStorage.getItem('password') != null)
			this.back.psw = localStorage.getItem('password');
		if (localStorage.getItem('loading') != null)
			this.back.loading = localStorage.getItem('loading');
		if (localStorage.getItem('logged') != null)
			this.back.logged = localStorage.getItem('logged');

		localStorage.clear();
		
		if (this.back.chk != 'true')
			this.back.logged = 'false';
		
	    if (this.back.chk == 'true' && this.back.logged == 'true'){
	    	
        	localStorage.setItem('logged', 'false');
        	localStorage.setItem('relog', 'true');
        	localStorage.setItem('user',this.back.usr);
        	localStorage.setItem('checked',this.back.chk);
        	localStorage.setItem('password',this.back.psw);
        	this._router.navigate(['login']);

	    }
	    else {

	    	localStorage.setItem('logged', this.back.logged);
	    }
	    localStorage.setItem('loading','false');
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
			this.back.logged = localStorage.getItem('logged');

		if (this.back.logged != '')
			return this.back.logged == 'true';
		else
			return false;


	}



	isLoading(){
		if (localStorage.getItem('loading') != null)
			this.back.loading = localStorage.getItem('loading');

		if (this.back.loading != '')
			return this.back.loading == 'true';
		else
			return false;
	}

}

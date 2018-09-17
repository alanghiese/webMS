import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filter } from './models/filter';
import { back } from './constants';
import { coverageObject, serviceObject } from './interfaces';
import { PAGES } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
	filter: Filter;
	clients: any[];
	doctors: any[] = [];	
	services: any[] = [];
	coverages: any[] = [];
	now: boolean = false;
	notFilter: boolean = localStorage.getItem('url') != null && (localStorage.getItem('url') == '/contact' || localStorage.getItem('url') == '/home');
	interval; //para el intervalo de datos en el momento
	stateFilter: boolean = false;






	constructor(private _router: Router) {

		// alert(	'FALTA PROGRAMA LOS DOCTORES Y SUS TURNOS TOMADOS/OFRECIDOS' +'\n'+
		// 		'HACER UN LOGIN MAS SEGURO EN CUANTO A LA ENCRIPTACION DEL PASSWORD' +'\n'+ 
		// 		'ESTE ALERT ESTA EN APP.COMPONENT.TS');
		
		// alert('podria tratar de poner tanto los filtros como los botones (o solo los botones) directamente en el componente que lo necesite')
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
		// if (localStorage.getItem('url') != null)
			// back.url = localStorage.getItem('url');

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
        	// localStorage.setItem('url',back.url);
        	this._router.navigate([PAGES.LOGIN]);
        	// this._router.navigate([{outlets: {withoutButtons: [PAGES.LOGIN]}}]);

	    }
	    else {

	    	localStorage.setItem('logged', back.logged);
        	// localStorage.setItem('url',back.url);
	    }
	    this._router.navigate([PAGES.LOGIN]);
		

	    
	    this.filter = new Filter('','','','','','Todos','','');


	}


	ngOnInit(){
		if(window.innerHeight > window.innerWidth)
    		alert("Para una mejor experiencia, utilizar el celular de forma horizontal");

	}

	// emptyScreen:boolean = false;
	// chA(value){
	// 	this.emptyScreen = value;
	// }

	
	isNotFilter():boolean{
		return this.notFilter;
	}

	setNotFilter(value: boolean){
		this.notFilter = value;
	}

	setCoverages(c:coverageObject[]){
		this.coverages = [];
		// console.log(c)
		for (var i = 0; i < c.length; i++) {
			if (c[i] != null)
				this.coverages.push(c[i].nombre);
		}
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

	setServices(s:serviceObject[]){
		for (var i = 0; i < s.length; i++) {
			if (s[i] != null)
				this.services.push(s[i].SERVICIO);
		}
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

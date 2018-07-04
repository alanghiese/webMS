import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Filter } from './models/filter';
import { LoginComponent } from './pages/login/login.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ LoginComponent ]
})
export class AppComponent {
	filter: Filter;


	constructor(private loginComponent:LoginComponent) {

		localStorage.setItem('loading', 'true');
	    if (localStorage.getItem('checked') != null && localStorage.getItem('checked') == 'true' &&
	    	localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'true'){
	    	
	    	this.loginComponent.acc.checked = localStorage.getItem('checked');
        	this.loginComponent.acc.user = localStorage.getItem('user');
        	this.loginComponent.acc.password = localStorage.getItem('password');
	    	this.loginComponent.login();
	    }
	    else {
	    	localStorage.setItem('logged','false');
	    	localStorage.setItem('loading','false');
	    }


	    this.filter = new Filter('','','','','Ninguno','Ninguno','Ninguno','Ninguno');
	}
	

	isLogged():boolean{
		if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
			return false;
		else if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'true')
			return true;


		else return false;
	}

	isLoading(){
		return localStorage.getItem('loading') == 'true';
	}

}

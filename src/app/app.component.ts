import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Filter } from './models/filter';
// import { LoginComponent } from './pages/login/login.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']/*,
  providers: [ LoginComponent ]*/
})
export class AppComponent {
	filter: Filter;
	clients:any[];

	back = {
    chk: '',
    usr: '',
    psw: '',
    logged: '',
    loading: ''
  	};


	constructor(private _router: Router) {

		// if (localStorage.getItem('loading')){
		// 	localStorage.removeItem('loading');
		// 	localStorage.setItem('loading', 'true');
		// }
        // localStorage.setItem('loading','false');

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
        	 // localStorage.setItem('loading','false');
        	this._router.navigate(['login']);
        	// console.log(this.back.loading);
			// console.log(this.back.chk);

	    }
	    else {

	    	localStorage.setItem('logged', this.back.logged);
        	// localStorage.setItem('user',this.back.usr);
        	// localStorage.setItem('checked',this.back.chk);
        	// localStorage.setItem('password',this.back.psw);	
        	// localStorage.setItem('loading','false');
	    }
	    localStorage.setItem('loading','false');
	    this._router.navigate(['login']);

	    

	    this.filter = new Filter('','','','','Ninguno','Ninguno','Ninguno','Ninguno');
	}

	setClients(c:any[]){
		this.clients = c;
	}

	getClients():any[]{
		if (this.clients)
			return this.clients;
		return null;
	}

	getCurrentClient(){
		if (this.clients)
			return this.clients[0];
		return null;
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

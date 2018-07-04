import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Filter } from './models/filter';
// import { LoginComponent } from './pages/login/login.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']//,
  // providers: [ LoginComponent ]
})
export class AppComponent {
	logged:boolean = false;
	filter: Filter;


	constructor(/*private loginComponent:LoginComponent*/) {

		// if (localStorage.getItem('checked') == null){
	 //      localStorage.setItem('checked','false');
	 //      localStorage.setItem('user','');
	 //      localStorage.setItem('password',''); 
	 //      this.logged = false;
	 //    }
	 //    else if (localStorage.getItem('checked') != null && localStorage.getItem('checked') == 'true'){
	 //      this.loginComponent.acc.checked = localStorage.getItem('checked');
	 //      this.loginComponent.acc.user = localStorage.getItem('user');
	 //      this.loginComponent.acc.password = localStorage.getItem('password');
	 //      if (localStorage.getItem('user') != null && localStorage.getItem('password') != null)
	 //        this.logged = true;
	      
	 //      if (this.logged)
	 //      	this.loginComponent.login();
	      
	      
	 //    }
	 //    this.logged = this.loginComponent.isLogged();
	 //    console.log(this.loginComponent.isLogged());
	 //    console.log(this.logged);




	    if ((localStorage.getItem('checked') != null) && (localStorage.getItem('checked') == 'true') 
	    	&& (localStorage.getItem('user') != null) && (localStorage.getItem('password') != null)){
	        this.logged = true;

	    }
	    else this.logged = false;

	    this.filter = new Filter('','','','','Ninguno','Ninguno','Ninguno','Ninguno');
	}
	

}

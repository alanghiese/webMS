import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Filter } from './models/filter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	logged:boolean = false;
	filter: Filter;

	constructor() {
	    if ((localStorage.getItem('checked') != null) && (localStorage.getItem('checked') == 'true') 
	    	&& (localStorage.getItem('user') != null) && (localStorage.getItem('password') != null)){
	        this.logged = true;
	    }
	    else this.logged = false;

	    this.filter = new Filter('','','','','Ninguno','Ninguno','Ninguno','Ninguno');
	}
	
}

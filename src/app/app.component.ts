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
		if ((localStorage.getItem('checked') != null) && (localStorage.getItem('checked') == 'false'))
        	this.logged = false;
	    if ((localStorage.getItem('checked') != null) && (localStorage.getItem('checked') == 'true')){
	        this.logged = true;
	    }

	    this.filter = new Filter('','','','','Ninguno','Ninguno','Ninguno','Ninguno');
	}
	
}

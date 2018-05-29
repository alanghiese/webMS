import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	logged:boolean;

	constructor() {
		if ((localStorage.getItem('checked') != null) && (localStorage.getItem('checked') == 'false'))
        	this.logged = false;
	    if ((localStorage.getItem('checked') != null) && (localStorage.getItem('checked') == 'true')){
	        this.logged = true;
	    }
	}
	
}

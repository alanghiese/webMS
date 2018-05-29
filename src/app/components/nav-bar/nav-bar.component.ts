import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'navBar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private _appComponent: AppComponent) { }

  ngOnInit() {
  }

  logout(){
  	this._appComponent.logged = false;
  	localStorage.clear();
  }

}

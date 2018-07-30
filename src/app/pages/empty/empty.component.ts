import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.css']
})
export class EmptyComponent implements OnInit {

  constructor(
              private _router: Router,
              private appComponent: AppComponent){}

  ngOnInit() {
    if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
      this._router.navigate(['login']);
    let backURL = this._router.url;
    localStorage.setItem('url', backURL);
    clearInterval(this.appComponent.interval);
    this.appComponent.setNotFilter(true);
    setTimeout(() => this._router.navigate(['home']),1);

  }
  

}

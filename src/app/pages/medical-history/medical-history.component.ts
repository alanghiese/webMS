import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { PAGES } from '../../constants';

@Component({
  selector: 'medicalHistory',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.css']
})
export class MedicalHistoryComponent implements OnInit {

  constructor(	private _router: Router,
  				private appComponent: AppComponent) { }

  ngOnInit() {

  	// let backURL = this._router.url;
    // localStorage.setItem('url', backURL);
    
    clearInterval(this.appComponent.interval);
    this.appComponent.setNotFilter(true);
    this.appComponent.stateFilter = false;
    if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
      this._router.navigate([PAGES.LOGIN]);
    else{
      setTimeout(() => this._router.navigate([PAGES.MEDICAL_HISTORY]),1);
    }
  }

}

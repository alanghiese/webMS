import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'realTime',
  templateUrl: './real-time.component.html',
  styleUrls: ['./real-time.component.css']
})
export class RealTimeComponent implements OnInit {

  constructor(private _router: Router) {}

  ngOnInit() {
  	if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
        this._router.navigate(['login']);
  }

}

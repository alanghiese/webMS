import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.css']
})
export class EmptyComponent implements OnInit {

  constructor(private _router: Router){}

  ngOnInit() {
  	if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
        this._router.navigate(['login']);

  }
  

}

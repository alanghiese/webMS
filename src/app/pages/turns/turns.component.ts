import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'turns',
  templateUrl: './turns.component.html',
  styleUrls: ['./turns.component.css']
})
export class TurnsComponent implements OnInit {

  constructor(private appComponent: AppComponent) { }

  ngOnInit() {
  }

  filter(){
  		console.log(this.appComponent.filter);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';

import { DbPetitionsComponent } from '../../providers/dbPetitions'

@Component({
  selector: 'realTime',
  templateUrl: './real-time.component.html',
  styleUrls: ['./real-time.component.css']
})
export class RealTimeComponent implements OnInit {
  timeToRefresh: number = 5000 * 60;
  private lastUpdate = '';
  a: number = 1000 * 60;
  constructor(
              private _router: Router,
              private appComponent: AppComponent,
              private dbPetitions:DbPetitionsComponent
              ){}

  ngOnInit() {
	clearInterval(this.appComponent.interval);
  	if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
        this._router.navigate(['login']);
    let backURL = this._router.url;
	localStorage.setItem('url', backURL);

  this.refresh();
	this.appComponent.interval = setInterval(() => this.refresh(), this.timeToRefresh);
  // this.myFunction();


  }
  
  setTime(value){
    let int = parseInt(value) * 1000 * 60;
  	this.timeToRefresh = int;
    clearInterval(this.appComponent.interval);
    this.appComponent.interval = setInterval(() => this.refresh(),this.timeToRefresh);
  }

  refresh(){
        this.dbPetitions.getStatic().subscribe((resp)=>{
          let r = resp;
          console.log(r);
        })
        let now = new Date();
        this.lastUpdate ='Ultima actualizacion a las: ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        // document.getElementById("number").innerHTML = (Math.random()*100).toString();
  }


  //GRAFICA
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
 
  public chartColors:Array<any> = [
        { 
            backgroundColor: 'orange',
        },
        { 
            backgroundColor: 'coral',
        }
    ];

}

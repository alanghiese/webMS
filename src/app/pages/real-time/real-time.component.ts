import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';

import { DbPetitionsComponent } from '../../providers/dbPetitions'
import { turnosV0 } from '../../interfaces';
import { nameAVG } from '../../models/regNameAVG';
import { prepareArrays } from '../../providers/prepareArrays';

@Component({
  selector: 'realTime',
  templateUrl: './real-time.component.html',
  styleUrls: ['./real-time.component.css']
})
export class RealTimeComponent implements OnInit {
  timeToRefresh: number = 5000 * 60;
  private lastUpdate = '';

  private turnsCompleteds: turnosV0[] = [];
  private delays: nameAVG[] = [];
  private prepareArrays: prepareArrays;
  private keepData: boolean = false;
  private stack = false;

  constructor(
              private _router: Router,
              private appComponent: AppComponent,
              private dbPetitions:DbPetitionsComponent
              ){}


  ngOnInit() {
    this.prepareArrays = new prepareArrays();
    this.appComponent.setNotFilter(false);
	  clearInterval(this.appComponent.interval);
  	if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
        this._router.navigate(['login']);
     else{
         console.log('cargar turnos');
          this.preparingTurns = true;
          // this.dbPetitions.getTurnsDoctors('','',new Date(),new Date(),'').subscribe();
          let from = this.convertToDate(this.appComponent.filter.selSince);
          let to = this.convertToDate(this.appComponent.filter.selUntil);
          from.setHours(0);
          from.setMilliseconds(0);
          from.setMinutes(0);
          to.setHours(0);
          to.setMilliseconds(0);
          to.setMinutes(0);

          // this.dbPetitions.getStatistics(from,to).subscribe((resp)=>{
          this.dbPetitions.getStatic().subscribe((resp)=>{ //sacar si uso la peticion en tiempo real
            if (resp){
              this.prepareArrays.prepareArray(resp);
              // console.log(this.turnsCompleteds);
              this.turnsCompleteds = this.prepareArrays.getTurnsCompleteds();
              this.prepareArrays.prepareArrayDoctors(this.turnsCompleteds);
              this.prepareArrays.doctorsAverage(this.turnsCompleteds);
              this.delays = this.prepareArrays.getDelays();
              // console.log(this.delays)
              this.filterFunction();
              // this.prepareGraphicDelay(this.delays);

              this.totalTurns = this.turnsCompleteds.length;

              this.preparingTurns = false;
            }
          },
          (err)=>{
              let msg = 'Ups! Algo salió mal, intente de nuevo';
              if (err.message.includes('session expired')){
                msg = 'Debe volver a iniciar sesion';
                localStorage.setItem('logged','false');
                this._router.navigate(['login']);
              }
              

              alert(msg);
      });
     }


    let backURL = this._router.url;
	  localStorage.setItem('url', backURL);


  
    	this.appComponent.interval = setInterval(() => this.refresh(), this.timeToRefresh);
      // this.myFunction();


  }
  
  getTotalTurns(){
    return this.totalTurns;
  }


  setTime(value){
    let int = parseInt(value) * 1000 * 60;
  	this.timeToRefresh = int;
    clearInterval(this.appComponent.interval);
    this.appComponent.interval = setInterval(() => this.refresh(),this.timeToRefresh);
  }


  turnsReady():boolean{
    return !this.preparingTurns;
  }

  refresh(){
      // this.dbPetitions.getStatistics(this.convertToDate(this.appComponent.filter.selSince),
      //               this.convertToDate(this.appComponent.filter.selUntil)
      // ).subscribe((resp)=>{ // va esto si es en tiempo real
      if (this.backSince != this.appComponent.filter.selSince || this.backUntil != this.appComponent.filter.selUntil){
        this.preparingTurns = true;
        this.dbPetitions.getStatic().subscribe((resp)=>{ //sacar si uso la peticion en tiempo real
              if (resp){
                // console.log(resp)
                this.prepareArrays.prepareArray(resp);
                // console.log(this.turnsCompleteds);
                this.turnsCompleteds = this.prepareArrays.getTurnsCompleteds();
                this.delays = this.prepareArrays.getDelays();

                this.filterFunction();
                this.backSince = this.appComponent.filter.selSince;
                this.backUntil = this.appComponent.filter.selUntil;
                this.preparingTurns = false;

              }
            });
      }
      else{
        this.preparingTurns = true;
        this.filterFunction();
        this.preparingTurns = false;
      }

      let now = new Date();
      this.lastUpdate ='Ultima actualizacion a las: ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  }


  filterFunction(){
      //FILTROS
    let backDelays: any[] = [];
    if (this.keepData)
      backDelays = this.delays;
    
    let arraySol = this.appComponent.filter.filter(this.turnsCompleteds);

    if (this.keepData)
      this.totalTurns = this.totalTurns + arraySol.length;
    else
      this.totalTurns = arraySol.length;
    
    this.prepareArrays.prepareArrayDoctors(arraySol);
    this.prepareArrays.doctorsAverage(arraySol);
      this.delays = this.prepareArrays.getDelays();

    if (this.keepData)
      for (var i = 0; i < backDelays.length; i++) {
        if (!this.contains(this.delays, backDelays[i]))
          this.delays.push(backDelays[i]);
      }
    this.prepareGraphicDelay(this.delays);
    }

    contains(array: nameAVG[], valueToCompare: nameAVG){
      let founded = false;
      for (var i = 0; i < array.length; i++) {
        if (array[i].name.toUpperCase() == valueToCompare.name.toUpperCase())
          founded = true;
      }
      return founded;
    }


  //para graficos de demora de medicos

  public nameOfTheDoctors:string[] = [];
  public datasOfTheDoctors:any[] = [];
  //para grafico de turnos medico a medico
  public optionsDelays:any = {
      scaleShowVerticalLines: false,
      responsive: true,
      scales: {
            yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 5,
                        // Create scientific notation labels
                        callback: function(value, index, values) {
                            return value + ' minutos';
                        }
                }
            }],
              xAxes: [{
                ticks: {
                    display: true,
                    // beginAtZero: true,
                    autoSkip: false,
                    // stepSize: 1,
                    // min: 0,
                    
                    maxRotation: 90,
                    minRotation: 90,
                    callback: function(value, index, values){
                      return value.split(" ").join("\n");
                    }
                  },
                  stacked: this.stack

              }]
          }

  };
//configuraciones generales para cualquier grafico
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  
  
  stackBars(){
    this.stack = !this.stack;
    
    this.optionsDelays = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
              yAxes: [{
                      ticks: {
                          beginAtZero: true,
                          maxTicksLimit: 5,
                          // Create scientific notation labels
                          callback: function(value, index, values) {
                              return value + ' minutos';
                          }
                  }
              }],
                xAxes: [{
                  ticks: {
                      display: true,
                      // beginAtZero: true,
                      autoSkip: false,
                      // stepSize: 1,
                      // min: 0,
                      
                      maxRotation: 90,
                      minRotation: 90,
                      callback: function(value, index, values){
                        return value.split(" ").join("\n");
                      }
                    },
                    stacked: this.stack

                }]
            }
      };  



  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

    clearCharts() {
    while (this.nameOfTheDoctors.length > 0)
      this.nameOfTheDoctors.pop();
      this.datasOfTheDoctors= [
        {data: [], label: 'label1'},
        {data: [], label: 'label2'}
        ];
   }


  prepareGraphicDelay(array: nameAVG[]){
    this.clearCharts();
    // console.log(this.nameOfTheDoctors);
    let auxAVGDoctors = [];
    let auxAVGPatients = [];

    for (var i = 0; i < array.length; i++) {
      if (array[i].avgDoctor != 0 || array[i].avgPatient != 0){
        this.nameOfTheDoctors.push(array[i].name);
        auxAVGDoctors.push(array[i].avgDoctor);
        auxAVGPatients.push(array[i].avgPatient);
      }
      
    }
    
    this.datasOfTheDoctors = [
            {data: auxAVGDoctors , label: 'Demora de doctores (en minutos)'},
            {data: auxAVGPatients , label: 'Demora de pacientes (en minutos)'}
            ];
            

  }



  
  private backSince = null;
  private backUntil = null;
  private preparingTurns: boolean = false;
  private totalTurns: number = 0;




  convertToDate(date:String):Date{
    // console.log(date);
    let d = new Date();
    //YYYY-MM-DD
    let second = date.lastIndexOf('-');
    let first = date.indexOf('-')
    let year = parseInt(date.substr(0,first));
    let month = parseInt(date.substr(first+1,second))-1;
    let day = parseInt(date.substr(second+1,date.length));

    d.setFullYear(year);
    d.setMonth(month);
    d.setDate(day);
    return d;

  }



}

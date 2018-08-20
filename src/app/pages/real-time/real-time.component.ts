import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';

import { DbPetitionsComponent } from '../../providers/dbPetitions'
import { turnosV0 } from '../../interfaces';
import { nameAVG } from '../../models/regNameAVG';
import { prepareArrays } from '../../providers/prepareArrays';
import { STATE_TURN, ERR_UPS } from '../../constants';

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
  private stack = false;
  private stateData: number[] = [0,0,0,0,0]; //ausentes, atendidos, esperando, falto, falto con aviso 

  constructor(
              private _router: Router,
              private appComponent: AppComponent,
              private dbPetitions:DbPetitionsComponent
              ){}


  ngOnInit() {
    let backURL = this._router.url;
    localStorage.setItem('url', backURL);
    this.appComponent.stateFilter = false;
    this.prepareArrays = new prepareArrays();
    this.appComponent.setNotFilter(false);
	  clearInterval(this.appComponent.interval);
  	if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
        this._router.navigate(['login']);
     else{
         console.log('cargar turnos');
          this.preparingTurns = true;

          let from = this.convertToDate(this.appComponent.filter.selSince);
          let to = this.convertToDate(this.appComponent.filter.selUntil);
          from.setHours(0);
          from.setMilliseconds(0);
          from.setMinutes(0);
          to.setHours(0);
          to.setMilliseconds(0);
          to.setMinutes(0);

          this.dbPetitions.getActualStatistics().subscribe((resp)=>{
          // this.dbPetitions.getStatic().subscribe((resp)=>{ //sacar si uso la peticion en tiempo real
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


              this.preparingTurns = false;
            }
          },
          (err)=>{
              let msg = ERR_UPS;
              if (err.message.includes('session expired')){
                msg = 'Debe volver a iniciar sesion';
                localStorage.setItem('logged','false');
                this._router.navigate(['login']);
              }
              

              alert(msg);
      });
     }


    


  
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

  getStatesOfTurns(array: turnosV0[]){
      this.stateData = [];

      let aux: number[] = [0,0,0,0,0];
      for (var i = 0; i < array.length; i++) {
        if (array[i].campo5.trim() == STATE_TURN.MISSING)
          aux[0] = aux[0] + 1;
        else if (array[i].campo5.trim() == STATE_TURN.ATTENDED) 
          aux[1] = aux[1] + 1;
        else if (array[i].campo5.trim() == STATE_TURN.WAITING)
          aux[2] = aux[2] + 1;
        else  if(array[i].campo5.trim() == STATE_TURN.F)
          aux[3] = aux[3] + 1;
        else if(array[i].campo5.trim() == STATE_TURN.FCA)
          aux[4] = aux[4] + 1;
        else 
          console.log(array[i]);
      }
      this.stateData = aux;
    }

  refresh(){
      this.turnsCompleteds = [];
      this.delays = [];
      // if (this.backSince != this.appComponent.filter.selSince || this.backUntil != this.appComponent.filter.selUntil){
        this.preparingTurns = true;
        this.dbPetitions.getActualStatistics(
      ).subscribe((resp)=>{
              if (resp){
                this.prepareArrays.prepareArray(resp);
                this.turnsCompleteds = this.prepareArrays.getTurnsCompleteds();
                this.delays = this.prepareArrays.getDelays();
              

                this.filterFunction();
                this.backSince = this.appComponent.filter.selSince;
                this.backUntil = this.appComponent.filter.selUntil;
                this.preparingTurns = false;

              }
            },
            (err)=>{
              let msg = ERR_UPS;
              if (err.message.includes('session expired')){
                msg = 'Debe volver a iniciar sesion';
                localStorage.setItem('logged','false');
                this._router.navigate(['login']);
              }
              });
      // }
      // else{
      // this.preparingTurns = true;
      // this.filterFunction();
      // this.preparingTurns = false;
      // }

      let now = new Date();
      this.lastUpdate ='Ultima actualizacion a las: ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
      console.log(this.lastUpdate);
  }


  filterFunction(){
      //FILTROS
    
    let arraySolOnlyOlds =  this.filterNewTurns(this.turnsCompleteds);
    let arraySol = this.appComponent.filter.filter(arraySolOnlyOlds);

    this.totalTurns = this.turnsCompleteds.length;
    
    this.prepareArrays.prepareArrayDoctors(arraySol);
    this.prepareArrays.doctorsAverage(arraySol);
    this.delays = this.prepareArrays.getDelays();

      
    this.prepareGraphicDelay(this.delays);
    this.getStatesOfTurns(this.turnsCompleteds);
  }

    contains(array: nameAVG[], valueToCompare: nameAVG){
      let founded = false;
      for (var i = 0; i < array.length; i++) {
        if (array[i].name.toUpperCase() == valueToCompare.name.toUpperCase())
          founded = true;
      }
      return founded;
    }

  filterNewTurns(array: turnosV0[]): turnosV0[]{
    let arr: turnosV0[] = [];
    for (var i = 0; i < array.length; i++) {
      if(array[i].campo3 != '' && array[i].campo4 != '')
        arr.push(array[i]);
    }
    return arr;
    
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';

import { DbPetitionsComponent } from '../../providers/dbPetitions'
import { turnosV0 } from '../../interfaces';
import { nameAVG } from '../../models/regNameAVG';
import { prepareArrays } from '../../providers/prepareArrays';
import { STATE_TURN, ERR_UPS, ANYBODY } from '../../constants';
import { PAGES } from '../../constants';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'realTime',
  templateUrl: './real-time.component.html',
  styleUrls: ['./real-time.component.css']
})
export class RealTimeComponent implements OnInit {
  private timeToRefresh: number = 5000 * 60;
  private lastUpdate = '';

  private turnsCompleteds: turnosV0[] = [];
  private delays: nameAVG[] = [];
  private prepareArrays: prepareArrays;
  private stack = false;
  private stateData: number[] = [0,0,0,0,0]; //ausentes, atendidos, esperando, falto, falto con aviso 
  private nameButton = "Nadie";
  private arrayPatients: turnosV0[] = []; 
  private arraySol: turnosV0[] = [];

  constructor(
              private _router: Router,
              private appComponent: AppComponent,
              private dbPetitions:DbPetitionsComponent,
              private modalService: NgbModal
              ){}


  ngOnInit() {
    // let backURL = this._router.url;
    // localStorage.setItem('url', backURL);
    
    this.appComponent.filterVisibility('visible');
    // this.appComponent.stateFilter = false;
    this.prepareArrays = new prepareArrays();
    // this.appComponent.setNotFilter(false);
	  clearInterval(this.appComponent.interval);
  	if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
        this._router.navigate([PAGES.LOGIN]);
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
              this.turnsCompleteds = this.prepareArrays.getTurnsCompleteds();
              this.prepareArrays.prepareArrayDoctors(this.turnsCompleteds);
              this.prepareArrays.doctorsAverage(this.turnsCompleteds);
              this.delays = this.prepareArrays.getDelays();
              this.filterFunction();


              this.preparingTurns = false;
            }
          },
          (err)=>{
              let msg = ERR_UPS;
              if (err.message.includes('session expired')){
                msg = 'Debe volver a iniciar sesion';
                localStorage.setItem('logged','false');
                this._router.navigate([PAGES.LOGIN]);
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



  open(content) {
    this.modalService.open(content);
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

      let aux: number[] = [0,0,0,0,0,0];
      for (var i = 0; i < array.length; i++) {
        if (array[i].campo5.trim() == STATE_TURN.MISSING){
          let now = new Date();
          let campo2 = array[i].campo2;
          let campo2Date= new Date();
          campo2Date.setHours(parseInt(campo2.substr(0,3)),parseInt(campo2.substr(4,6)));
          // console.log(campo2);
          // console.log('campo2 ' + campo2Date.getHours());
          if (now<campo2Date)
            aux[0] = aux[0] + 1;
          else
            aux[5] = aux[5] + 1;
      }
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
              this._router.navigate([PAGES.LOGIN]);
            }
            });
      let now = new Date();
      this.lastUpdate ='Ultima actualizacion a las: ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
      console.log(this.lastUpdate);
  }


  filterFunction(){
      //FILTROS
    this.totalTurns = this.turnsCompleteds.length;
    this.arraySol = [];
    let arraySolOnlyOlds =  this.filterNewTurns(this.turnsCompleteds);
    this.arraySol = this.appComponent.filter.filter(arraySolOnlyOlds);
    this.prepareArrays.prepareArrayDoctors(this.arraySol);
    this.prepareArrays.doctorsAverage(this.arraySol);
    this.delays = this.prepareArrays.getDelays();     
    this.prepareGraphicDelay(this.delays);

    let SolutionWithAllStates = this.appComponent.filter.filter(this.turnsCompleteds);
    this.getStatesOfTurns(SolutionWithAllStates);
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
                    autoSkip: false,
                    
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
                      autoSkip: false,
                      
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
    this.arrayPatients = []
    if (e.active != {}){
      this.nameButton=e.active[0]._model.label;
      
        for (var i = 0; i < this.arraySol.length; ++i) {
          if (this.arraySol[i].campo1.trim().toUpperCase() == this.nameButton.trim().toUpperCase())
            this.arrayPatients.push(this.arraySol[i]);
        
        }
        
        document.getElementById("expand").click();
    }
    else
      this.nameButton = ANYBODY;
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

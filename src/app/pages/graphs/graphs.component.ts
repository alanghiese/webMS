import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import { DbPetitionsComponent } from '../../providers/dbPetitions';
import { turnosV0 } from '../../interfaces';
import { nameAVG } from '../../models/regNameAVG';
import { prepareArrays } from '../../providers/prepareArrays';
import { STATE_TURN } from '../../constants';





import { UserCredentials } from '../../interfaces';

const now = new Date();

@Component({
  selector: 'graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {


	private graphtype: string = '1';
	private turnsCompleteds: turnosV0[] = [];
	private delays: nameAVG[] = [];
	private keepData: boolean = false;
	private backSince = null;
	private backUntil = null;
	private preparingTurns: boolean = false;
	private totalTurns: number = 0;
	private showTableB: boolean = false;
	private stack = false;
	private prepareArrays: prepareArrays;

	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private appComponent: AppComponent,
		private dbPetitions: DbPetitionsComponent
	){}

	ngOnInit() {
		this.prepareArrays = new prepareArrays();

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
					// this.prepareGraphicTurns();
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
        this.appComponent.setNotFilter(false);
        this.backSince = this.appComponent.filter.selSince;
        this.backUntil = this.appComponent.filter.selUntil;
        let backURL = this._router.url;
		localStorage.setItem('url', backURL);
		clearTimeout(this.appComponent.interval);
		
	}

	turnsReady():boolean{
		return !this.preparingTurns;
	}
	



	hideOrShowTable(){
		this.showTableB = !this.showTableB;
	}

	showTable(){
		return this.showTableB;
	}




	
  	//filtrar
  	filter(){
  		// this.dbPetitions.getStatistics(this.convertToDate(this.appComponent.filter.selSince),
  		// 							this.convertToDate(this.appComponent.filter.selUntil)
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

  		// console.log(this.appComponent.filter);
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
		this.prepareGraphicTurns();
  	}

  	contains(array: nameAVG[], valueToCompare: nameAVG){
  		let founded = false;
  		for (var i = 0; i < array.length; i++) {
  			if (array[i].name.toUpperCase() == valueToCompare.name.toUpperCase())
  				founded = true;
  		}
  		return founded;
  	}

  	
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




	//para graficos de demora de medicos

	public nameOfTheDoctors:string[] = [];
	public datasOfTheDoctors:any[] = [];


	clearCharts() {
		while (this.nameOfTheDoctors.length > 0)
			this.nameOfTheDoctors.pop();
	    this.datasOfTheDoctors= [
	      {data: [], label: 'label1'},
	      {data: [], label: 'label2'}
	    	];
	    this.dataTurns= [
	      {data: [], label: 'label1'},
	      {data: [], label: 'label2'}
	    	];
 	}


	private auxCountWeb = [];
	private auxCountDesktop = [];
	prepareGraphicDelay(array: nameAVG[]){
		this.clearCharts();
		// console.log(this.nameOfTheDoctors);
		let auxAVGDoctors = [];
		let auxAVGPatients = [];
		this.auxCountDesktop = [];
		this.auxCountWeb = [];

		for (var i = 0; i < array.length; i++) {
			if (array[i].avgDoctor != 0 || array[i].avgPatient != 0){
				this.nameOfTheDoctors.push(array[i].name);
				auxAVGDoctors.push(array[i].avgDoctor);
				auxAVGPatients.push(array[i].avgPatient);
				this.auxCountDesktop.push(array[i].countDesktop);
				this.auxCountWeb.push(array[i].countWeb);	
			}
			
		}
		
		this.datasOfTheDoctors = [
						{data: auxAVGDoctors , label: 'Demora de doctores (en minutos)'},
						{data: auxAVGPatients , label: 'Demora de pacientes (en minutos)'}
						];
		this.dataTurns = [
							{data: this.auxCountDesktop , label: 'Cantidad de turnos por escritorio'},
							{data: this.auxCountWeb , label: 'Cantidad de turnos por web'}
						];

		this.getStatesOfTurns();
						
						

	}
	private minMax = [];
	private avgs = [];
	prepareGraphicTurns(){
		let a = 0;

		for (var i = 0; i < this.auxCountDesktop.length; i++) {
			a = a + this.auxCountDesktop[i]
		}


		let b = 0;
		for (var k = 0; k < this.auxCountWeb.length; k++) {
			b = b + this.auxCountWeb[k]
		}
		
		this.pieChartData = [b,a];
		this.minMax = this.getMinAndMax();
		this.avgs = this.getAVGs();
	}
	
	getMinAndMax():number[]{
		let minWeb = this.auxCountWeb[0];
		let minDesktop = this.auxCountDesktop[0];

		let maxWeb = this.auxCountWeb[0];
		let maxDesktop = this.auxCountDesktop[0];

		for (var i = 1; i < this.auxCountWeb.length; i++) {
			if (this.auxCountWeb[i]>maxWeb)
				maxWeb = this.auxCountWeb[i]
			if (this.auxCountWeb[i]<minWeb)
				minWeb = this.auxCountWeb[i]

			if (this.auxCountDesktop[i]>maxDesktop)
				maxDesktop = this.auxCountDesktop[i]
			if (this.auxCountDesktop[i]<minDesktop)
				minDesktop = this.auxCountDesktop[i]
		}


		return [minWeb,minDesktop,maxWeb,maxDesktop];
	}

	getAVGs():any[]{
		let avgWeb = 0;
		let avgDesktop = 0;
		for (var i = 0; i < this.auxCountWeb.length; i++) {
			avgWeb = avgWeb + this.auxCountWeb[i];
			avgDesktop = avgDesktop + this.auxCountDesktop[i];
		}
		avgWeb = parseInt((avgWeb/this.auxCountWeb.length).toFixed(2));
		avgDesktop = parseInt((avgDesktop/this.auxCountDesktop.length).toFixed(2));
		return [avgWeb,avgDesktop];
	}



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

	//para grafico de turnos medico a medico
	private dataTurns:any[] = [];
	public optionsTurns:any = {
	    scaleShowVerticalLines: false,
	    responsive: true,
	    scales: {
	    			yAxes: [{
                		ticks: {
                    		beginAtZero: true,
                    		maxTicksLimit: 5,
                    		// Create scientific notation labels
                    		callback: function(value, index, values) {
                        		return value + ' turnos';
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

	
	//para grafico de turnos global

	public pieChartLabels:string[] = ['Turnos Web', 'Turnos Escritorio'];
  	public pieChartData:number[] = [];
  	public pieChartType:string = 'pie';



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

		this.optionsTurns = {
		    scaleShowVerticalLines: false,
		    responsive: true,
		    scales: {
		    			yAxes: [{
	                		ticks: {
	                    		beginAtZero: true,
	                    		maxTicksLimit: 5,
	                    		// Create scientific notation labels
	                    		callback: function(value, index, values) {
	                        		return value + ' turnos';
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
 

	//grafico de torata estado de turnos
	public stateLabels:string[] = ['Aun no se presentan', 'Atendidos', 'En sala de espera'];
  	public stateData:number[] = [];

  	getStatesOfTurns(){
  		let aux: number[] = [0,0,0];
  		for (var i = 0; i < this.turnsCompleteds.length; i++) {
  			if (this.turnsCompleteds[i].campo5 == STATE_TURN.MISSING)
  				aux[0] = aux[0] + 1;
  			else if (this.turnsCompleteds[i].campo5 == STATE_TURN.ATTENDED) 
  				aux[1] = aux[1] + 1;
  			else
  				aux[2] = aux[2] + 1;
  		}
  		this.stateData = aux;
  	}


	getTotalTurns(){
		return this.totalTurns;
	}


	//funciones booleanas para comparar que tipo de grafico voy a tener que mostrar

	isTemp():boolean{
		return this.graphtype == '0';
	}

	isDelay():boolean{
		return this.graphtype == '1';
	}

	isWebVsDesktop():boolean{
		return this.graphtype == '2';
	}

	isState(): boolean{
		return this.graphtype == '3';
	}

}

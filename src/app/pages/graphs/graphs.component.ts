import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import { DbPetitionsComponent } from '../../providers/dbPetitions';
import { turnosV0, webVSdesktop } from '../../interfaces';
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
	private delaysWithStateFilter: nameAVG[] = [];
	private keepData: boolean = false;
	private backSince = null;
	private backUntil = null;
	private preparingTurns: boolean = false;
	private totalDelays: number = 0;
	private totalOthers: number = 0;
	private showTableB: boolean = false;
	private stack = false;
	private prepareArrays: prepareArrays;
	private webVSdesktopArr: webVSdesktop[] = [];

	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private appComponent: AppComponent,
		private dbPetitions: DbPetitionsComponent
	){}

	ngOnInit() {
		this.appComponent.setNotFilter(false);
		let backURL = this._router.url;
		localStorage.setItem('url', backURL);
		clearTimeout(this.appComponent.interval);
		this.prepareArrays = new prepareArrays();
		let preparingTurns1 = true;
		let preparingTurns2 = true;

		if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
        	this._router.navigate(['login']);
        else{
        	console.log('cargando turnos...');	
        	this.preparingTurns = true;
        	this.dbPetitions.getTurnsDoctors(this.convertToDate(this.appComponent.filter.selSince),
        									this.convertToDate(this.appComponent.filter.selUntil)
        	).subscribe((turnsD)=>{
        		if (turnsD){
        			// console.log(turnsD);
        			let sizeString:string = turnsD.data.msg;
        			let index = sizeString.indexOf(' ');
        			let size: number = parseInt(sizeString.substr(0,index));
        			// console.log(size);
        			// this.filterTemp();




        			preparingTurns2 = false;
        			this.preparingTurns = preparingTurns1;
        		}

        	},
        	(err)=>{
				let msg = 'Ups! Algo salió mal, intente de nuevo';
	          	if (err.message.includes('session expired')){
	          		msg = 'Debe volver a iniciar sesion';
	          		localStorage.setItem('logged','false');
	          		this._router.navigate(['login']);
	          	}
	          	});
        	


        	let from = this.convertToDate(this.appComponent.filter.selSince);
        	let to = this.convertToDate(this.appComponent.filter.selUntil);
        	from.setHours(0);
			from.setMilliseconds(0);
			from.setMinutes(0);
			to.setHours(0);
			to.setMilliseconds(0);
			to.setMinutes(0);

        	this.dbPetitions.getStatistics(from,to).subscribe((resp)=>{
        	// this.dbPetitions.getStatic().subscribe((resp)=>{ //sacar si uso la peticion en tiempo real
        		if (resp){
        			// console.log(resp);
        			this.prepareArrays.prepareArray(resp);
        			this.turnsCompleteds = this.prepareArrays.getTurnsCompleteds();        			
        			// console.log(this.turnsCompleteds);
        			this.prepareArrays.prepareArrayDoctors(this.turnsCompleteds);
        			this.prepareArrays.doctorsAverage(this.turnsCompleteds);
	        		this.delays = this.prepareArrays.getDelays();
	        		// console.log(this.delays);
	        		this.webVSdesktopArr = this.prepareArrays.onlyCountWebDesktopTurns(this.turnsCompleteds);
	        		

	        		this.filterFunction();

        			// this.prepareGraphicDelay(this.delays);
					// this.prepareGraphicTurns();

        			preparingTurns1 = false;
        			this.preparingTurns = preparingTurns2;
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
        
        this.backSince = this.appComponent.filter.selSince;
        this.backUntil = this.appComponent.filter.selUntil;
        
		
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
  		
  		if (this.backSince != this.appComponent.filter.selSince || this.backUntil != this.appComponent.filter.selUntil){
  			this.preparingTurns = true;
	  		// this.dbPetitions.getStatic().subscribe((resp)=>{ //sacar si uso la peticion en tiempo real
	  		this.dbPetitions.getStatistics(this.convertToDate(this.appComponent.filter.selSince),
  									this.convertToDate(this.appComponent.filter.selUntil)
  		).subscribe((resp)=>{
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
	        	},
        		(err)=>{
					let msg = 'Ups! Algo salió mal, intente de nuevo';
		          	if (err.message.includes('session expired')){
		          		msg = 'Debe volver a iniciar sesion';
		          		localStorage.setItem('logged','false');
		          		this._router.navigate(['login']);
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
		
		let turnsAttended =  this.filterNewTurns(this.turnsCompleteds);
    	let arraySol = this.appComponent.filter.filter(turnsAttended);

    	
		



		this.prepareArrays.prepareArrayDoctors(arraySol);
		this.prepareArrays.doctorsAverage(arraySol);
	    this.delays = this.prepareArrays.getDelays();

		if (this.keepData)
			for (var i = 0; i < backDelays.length; i++) {
				if (!this.contains(this.delays, backDelays[i]))
					this.delays.push(backDelays[i]);
			}
		this.prepareGraphicDelay(this.delays);




		let backDelaysState = this.delaysWithStateFilter;

		let turnsCompletedsWithStateFilter = this.appComponent.filter.filterState(this.turnsCompleteds);
		let newTurnsFilter = this.appComponent.filter.filter(turnsCompletedsWithStateFilter);

		this.prepareArrays.prepareArrayDoctors(newTurnsFilter);
		this.prepareArrays.doctorsAverage(newTurnsFilter);
	    this.delaysWithStateFilter = this.prepareArrays.getDelays();

	    this.webVSdesktopArr = this.prepareArrays.onlyCountWebDesktopTurns(newTurnsFilter);

	    if (this.keepData)
			for (var i = 0; i < backDelaysState.length; i++) {
				if (!this.contains(this.delaysWithStateFilter, backDelaysState[i]))
					this.delays.push(backDelaysState[i]);
			}

	    
		this.prepareGraphicTurns(this.delaysWithStateFilter);
		this.getStatesOfTurns(newTurnsFilter);







		if (this.keepData){
			this.totalDelays = this.totalDelays + arraySol.length;
			this.totalOthers = this.totalOthers + turnsCompletedsWithStateFilter.length;
		}
		else{
			this.totalDelays = arraySol.length;
			this.totalOthers = newTurnsFilter.length;
		}
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
	private nameOfTheDoctorsTurns:string[] = [];
	public datasOfTheDoctors:any[] = [];


	clearCharts() {
		while (this.nameOfTheDoctors.length > 0)
			this.nameOfTheDoctors.pop();
		while (this.nameOfTheDoctorsTurns.length > 0)
			this.nameOfTheDoctorsTurns.pop();

	    this.datasOfTheDoctors= [
	      {data: [], label: 'label1'},
	      {data: [], label: 'label2'}
	    	];
	    this.dataTurns= [
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

		// console.log(this.datasOfTheDoctors);
		

		
						
						

	}
	
	private auxCountWeb = [];
	private auxCountDesktop = [];
	private minMax = [];
	private avgs = [];
	prepareGraphicTurns(delay: nameAVG[]){


		this.auxCountDesktop = [];
		this.auxCountWeb = [];
		this.pieChartData = [];
		
		for (var i = 0; i < delay.length; i++) {
			this.nameOfTheDoctorsTurns.push(delay[i].name);
		}

		// console.log(this.nameOfTheDoctorsTurns);

		for (var k = 0; k < this.nameOfTheDoctorsTurns.length; k++) {
				this.auxCountDesktop.push(this.webVSdesktopArr[k].desktop);
				this.auxCountWeb.push(this.webVSdesktopArr[k].web);	
		}			

		this.dataTurns = [
							{data: this.auxCountWeb , label: 'Cantidad de turnos por web'},
							{data: this.auxCountDesktop , label: 'Cantidad de turnos por escritorio'}
						];



		let a = 0;

		for (var i = 0; i < this.auxCountDesktop.length; i++) {
			a = a + parseInt(this.auxCountDesktop[i]);
		}


		let b = 0;
		for (var k = 0; k < this.auxCountWeb.length; k++) {
			b = b + parseInt(this.auxCountWeb[k]);
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
			avgWeb = avgWeb + parseInt(this.auxCountWeb[i]);
			avgDesktop = avgDesktop + parseInt(this.auxCountDesktop[i]);
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
	public stateLabels:string[] = ['Aun no se presentan', 'Atendidos', 'En sala de espera', 'Falto', 'Falto con aviso'];
  	public stateData:number[] = [];

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


	getTotalTurns(){
		if (this.isDelay())
			return this.totalDelays;
		else 
			return this.totalOthers; 
	}




	filterTemp(){
		alert('SOY UN FILTRO DISTINTO')
	}

	onChangeType(){
		if (this.isDelay())
			this.appComponent.stateFilter = false;
		else 
			this.appComponent.stateFilter = true;
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

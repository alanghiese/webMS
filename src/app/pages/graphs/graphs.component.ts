import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import { DbPetitionsComponent } from '../../providers/dbPetitions';
import { MathsFunctions } from '../../providers/mathsFunctions';
import { turnosV0 } from '../../interfaces';
import { nameAVG } from './regNameAVG';





import { UserCredentials } from '../../interfaces';

const now = new Date();

@Component({
  selector: 'graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css'],
  providers: [ MathsFunctions ]
})
export class GraphsComponent implements OnInit {


	private graphtype: string = '1';
	private turnsCompleteds: turnosV0[] = [];
	private delays: nameAVG[] = [];
	private doctorsLoaded: boolean = false;
	private keepData: boolean;
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private appComponent: AppComponent,
		private dbPetitions: DbPetitionsComponent,
		private math: MathsFunctions
	){}

	ngOnInit() {
		if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
        	this._router.navigate(['login']);
        else{
        	console.log('cargar turnos');
        	// this.dbPetitions.getTurnsDoctors('','',new Date(),new Date(),'').subscribe();
        	let from = new Date();
        	from.setDate(19);
        	from.setMonth(6);
        	from.setFullYear(2018);
        	this.dbPetitions.getStatistics(from,from).subscribe((resp)=>{
        		if (resp){
        			// console.log(resp)
        			this.prepareArray(resp);
        			console.log(this.turnsCompleteds);
        			this.prepareArrayDoctors(this.turnsCompleteds);
        			this.doctorsAverage(this.turnsCompleteds);
        			this.prepareGraphicDelay(this.delays);
        			this.doctorsLoaded = true;
        			// console.log(this.doctors);
        		}
        	});
        }


        let backURL = this._router.url;
		localStorage.setItem('url', backURL);
		clearTimeout(this.appComponent.interval);
		
	}

	isDoctorsLoaded():boolean{
		return this.doctorsLoaded;
	}
	

	prepareArray(array: turnosV0[]){
		this.turnsCompleteds = [];
		let intC;
		if(!array.length){
			let c;
			for (var i in array) {
				if (parseInt(i))
					c = i;
			}
		intC = parseInt(c);
		}
		else intC = array.length;
		for (var k = 0; k < intC; k++) {
			if(array[k].campo3 != '' && array[k].campo4 != '')
				this.turnsCompleteds.push(array[k]);
		}
	}

	prepareArrayDoctors(array:turnosV0[]){
		let founded: boolean = false;
		this.delays = [];
		if (array.length > 0)
			this.delays.push({name: array[0].campo1, avgDoctor: 0, avgPatient: 0});

		for (var i = 1; i < array.length; i++) {
			for (var k = 0; k < this.delays.length; k++) 
				if (this.delays[k].name == array[i].campo1)
					founded = true;

			if (!founded)
				this.delays.push({name:array[i].campo1, avgDoctor: 0, avgPatient: 0});
			founded = false;
		}
	}

	doctorsAverage(fullTurns:turnosV0[]){
		
		for (var i = 0; i < this.delays.length; i++) {
			this.delays[i].avgDoctor = this.math.avgDoctor(this.delays[i].name,fullTurns);
			this.delays[i].avgPatient = this.math.avgPatient(this.delays[i].name,fullTurns);
		}
	}


	
  	//filtrar
  	filter(){
  		this.dbPetitions.getStatistics(this.convertToDate(this.appComponent.filter.selSince),
  									this.convertToDate(this.appComponent.filter.selUntil)
  		).subscribe((resp)=>{
        		if (resp){
        			console.log(resp)
        			this.prepareArray(resp);
        			// console.log(this.turnsCompleteds);

        			//FILTROS
        			let backDelays: any[] = [];
					if (this.keepData)
						backDelays = this.delays;

			  		let datesTurns: turnosV0[] = [];
					this.filterDates(datesTurns,this.turnsCompleteds);//si no uso el estatico no deberia ser necesario esto

			  		let doctorsTurns: turnosV0[] = [];

					this.filterDoctors(doctorsTurns,datesTurns);

					let servicesTurn: turnosV0[] = [];
					this.filterService(servicesTurn,doctorsTurns);
					//FIN DE FILTROS
					console.log(servicesTurn);

        			this.prepareArrayDoctors(servicesTurn);
					this.doctorsAverage(servicesTurn);
					if (this.keepData)
						for (var i = 0; i < backDelays.length; i++) {
							if (!this.contains(this.delays, backDelays[i]))
								this.delays.push(backDelays[i]);
						}
					this.prepareGraphicDelay(this.delays);
        		}
        	});

  		console.log(this.appComponent.filter);
  	}

  	contains(array: nameAVG[], valueToCompare: nameAVG){
  		let founded = false;
  		for (var i = 0; i < array.length; i++) {
  			if (array[i].name == valueToCompare.name)
  				founded = true;
  		}
  		return founded;
  	}

  	filterDoctors(array: turnosV0[], full: turnosV0[]){
  		
  		if (this.appComponent.filter.selDoctor != ''){
			for (let k = 0; k < full.length ; k++) {
				if (full[k].campo1 == this.appComponent.filter.selDoctor){
					array.push(full[k]);
				}
			}
		}
		else {
			for (let k = 0; k < full.length ; k++) {
				array.push(full[k]);
			}
		}
  	}

  	filterService(array: turnosV0[], full: turnosV0[]){
  		

  		if (this.appComponent.filter.selService != ''){
			for (let k = 0; k < full.length ; k++) {
				console.log(full[k].campo7)
				if (full[k].campo7 == this.appComponent.filter.selService)
					array.push(full[k]);
			}
		}
		else {
			for (let k = 0; k < full.length ; k++) {
				array.push(full[k]);
			}
		}
  	}

  	filterDates(array,arrayToCompare:turnosV0[]){
		let since = this.convertToDate(this.appComponent.filter.selSince);
		let until = this.convertToDate(this.appComponent.filter.selUntil);
		
		since.setHours(0);
		since.setMilliseconds(0);
		since.setMinutes(0);
		since.setSeconds(0);
		until.setHours(23,59,59);

		for (let k = 0; k < arrayToCompare.length ; k++) {
			
			let date = new Date(arrayToCompare[k].fecha1);
			if (date >= since && date <= until)
				array.push(this.turnsCompleteds[k]);
		}
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



	//funciones booleanas para comparar que tipo de grafico voy a tener que mostrar

	isTemp():boolean{
		return this.graphtype == '0';
	}

	isDelay():boolean{
		return this.graphtype == '1';
	}




	//para graficos de demora de medicos

	public nameOfTheDoctors:string[] = [];
	public datasOfTheDoctors:any[] = [];


	clearCharts() {
    this.nameOfTheDoctors= [];
    this.datasOfTheDoctors= [
      {data: [], label: 'label1'},
      {data: [], label: 'label2'}
    	];
 	}

	prepareGraphicDelay(array: nameAVG[]){
		// this.nameOfTheDoctors = [];
		// this.datasOfTheDoctors = [];
		this.clearCharts();
		let auxAVGDoctors = [];
		let auxAVGPatients = [];
		for (var i = 0; i < array.length; i++) {
			this.nameOfTheDoctors.push(array[i].name);
			auxAVGDoctors.push(array[i].avgDoctor);
			auxAVGPatients.push(array[i].avgPatient);
		}
		for (var k = 0; k < this.nameOfTheDoctors.length; k++) {
			// console.log(this.nameOfTheDoctors[k].split(" ").join("\n"));	
			this.nameOfTheDoctors[k] = this.nameOfTheDoctors[k].split(" ").join("\n");//.replace(" ", "\n");
		}
		this.datasOfTheDoctors = [
						{data: auxAVGDoctors , label: 'Demora de doctores (en minutos)'},
						{data: auxAVGPatients , label: 'Demora de pacientes (en minutos)'}
						];

	}


	//para graficos de turnos
	private stack = false;
	stackBars(){
		this.stack = !this.stack;
		
		this.barChartOptions = {
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
	public barChartOptions:any = {
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

	public barChartType:string = 'bar';
	public barChartLegend:boolean = true;

	

	// events
	public chartClicked(e:any):void {
		console.log(e);
	}

	public chartHovered(e:any):void {
		console.log(e);
	}
 

}

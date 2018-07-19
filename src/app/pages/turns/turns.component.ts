import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { UPPERCASE } from '../../pipes/toUpperCase.pipe';
import { MathsFunctions } from '../../providers/mathsFunctions'
import { Router } from '@angular/router';
import { DbPetitionsComponent } from '../../providers/dbPetitions';
import { turnosV0 } from '../../interfaces';
import { tuple } from './tuple';



@Component({
  selector: 'turns',
  templateUrl: './turns.component.html',
  styleUrls: ['./turns.component.css'],
  providers: [ 
  				MathsFunctions,
  				DbPetitionsComponent
  			 ]
})
export class TurnsComponent implements OnInit {

	private valueGroupBy: any = "Cobertura";

	private turns: turnosV0[] = [];
	private allCoverages:string[] = [];
	private allServices:string[] = [];
	private nameOfCoverages: string[] = [];
	private nameOfServices: string[] = [];
	private finalCoverage: tuple[] = []; 
	private finalService: tuple[] = []; 

	constructor(
		private appComponent: AppComponent, 
		private maths: MathsFunctions,
		private _router: Router,
		private _dbPetitions: DbPetitionsComponent
		){}

	ngOnInit() {
		let array: any;
		if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
        	this._router.navigate(['login']);
    	else
			this._dbPetitions.getStatic().subscribe( (resp) => {
				array = resp;
				console.log('cargando datos en el arreglo...')
				if (resp){
					// console.log(array);
					console.log('cargado!');
					// console.log(resp);
					this.prepareArray(array,this.turns);
					// console.log(this.turns);
					this.prepararArreglos(this.turns); 
					this.extraerCoberturas(this.turns);
					// this.extraerServicios();
					this.finalizeArrays();
					
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
			}
			);
		let backURL = this._router.url;
		localStorage.setItem('url', backURL);
		clearInterval(this.appComponent.interval);


	}
	prepareArray(array,arraySol){
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
		// console.log(c);

		for (let k = 0; k < intC ; k++) {
			// console.log(array[k]);
			arraySol.push(array[k]);
		}
	}

	getNumberOfTurns():number{
		if (this.valueGroupBy == 'Cobertura')
			return this.allCoverages.length;
		else if (this.valueGroupBy == 'Servicio')
			return this.allServices.length;
		return 0;
	}
	
	

	prepararArreglos(array:turnosV0[]){
		
		this.allCoverages=[];
		this.allServices=[];
		
		for (var i = 0; i < array.length; ++i) {
			this.allCoverages[i] = array[i].campo6;
			// this.allServices[i] = array[i].servicio;
		}
	}

	extraerCoberturas(array:turnosV0[]){
		
		this.nameOfCoverages=[];
		for (var i = 0; i < array.length; ++i) {
			let founded:boolean = false;
			for (var k = 0; k <= this.nameOfCoverages.length-1; ++k) {
				if (this.nameOfCoverages[k]==array[i].campo6)
					founded = true;
			}
			if (!founded)
				this.nameOfCoverages.push(array[i].campo6);
			else founded = false;
		}
	}

	// extraerServicios(array:turnosV0[]){
		
		//this.nameOfServices=[];
	// 	for (var i = 0; i <= array.length-1; ++i) {
	// 		let founded:boolean = false;
	// 		for (var k = 0; k <= this.nameOfServices.length-1; ++k) {
	// 			if (this.nameOfServices[k]==array[i].servicio)
	// 				founded = true;
	// 		}
	// 		if (!founded)
	// 			this.nameOfServices.push(array[i].servicio);
	// 		else founded = false;
	// 	}
	// }


	finalizeArrays(){
		this.finalCoverage = [];
		this.finalService = [];
		for (var i=0; i<this.nameOfCoverages.length; i++){
			let t = new tuple('',0,0);
			t.name = this.nameOfCoverages[i];
			t.percentage = this.maths.calculatePercentage(this.allCoverages,this.nameOfCoverages[i]);
			t.count = this.maths.count(this.allCoverages,this.nameOfCoverages[i]);
			this.finalCoverage.push(t);
		}
		// for (var i=0; i<this.nameOfServices.length; i++){
		// 	let t:tuple;
		// 	t.name = this.nameOfServices[i];
		// 	t.percentage = this.maths.calculatePercentage(this.allServices,this.nameOfServices[i]);
		// 	t.count = this.maths.count(this.allServices,this.nameOfServices[i]);
		// 	this.finalCoverage.push(t);
		// }


		this.finalCoverage.sort(
			function(a,b){
				return b.percentage - a.percentage;
			}
		);


	}


	filter(){
		let doctorsTurns: turnosV0[] = [];
		this.filterDoctors(doctorsTurns);

		let datesTurns: turnosV0[] = [];
		this.filterDates(datesTurns,doctorsTurns);

		this.prepararArreglos(datesTurns); 
		this.extraerCoberturas(datesTurns);
		// this.extraerServicios(newTurns);
		this.finalizeArrays();
		console.log(this.appComponent.filter);
	}

	filterDoctors(array){
		if (this.appComponent.filter.selDoctor != ''){
			for (let k = 0; k < this.turns.length ; k++) {
				if (this.turns[k].campo2 >= this.appComponent.filter.selSince)
					array.push(this.turns[k]);
			}
		}
		else {
			for (let k = 0; k < this.turns.length ; k++) {
				array.push(this.turns[k]);
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
				array.push(this.turns[k]);
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


	onChangeGroupBy(value:any){
		this.valueGroupBy = value;
	}


	coverage():boolean{
		return this.valueGroupBy == "Cobertura";
	}

	service():boolean{
		return this.valueGroupBy == "Servicio";
	}
}

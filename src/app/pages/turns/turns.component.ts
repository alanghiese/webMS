import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { UPPERCASE } from '../../pipes/toUpperCase.pipe';
import { MathsFunctions } from '../../providers/mathsFunctions'
import { Router } from '@angular/router';
import { DbPetitionsComponent } from '../../providers/dbPetitions';
import { turnosV0 } from '../../interfaces';



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
	private cob:string[] = [];
	private ser:string[] = [];
	private cobs: string[] = [];
	private sers: string[] = [];

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
			return this.cob.length;
		else if (this.valueGroupBy == 'Servicio')
			return this.ser.length;
		return 0;
	}
	

	prepararArreglos(array:turnosV0[]){
		
		this.cob=[];
		this.ser=[];
		
		for (var i = 0; i < array.length; ++i) {
			this.cob[i] = array[i].campo6;
			// this.ser[i] = array[i].servicio;
		}
	}

	extraerCoberturas(array:turnosV0[]){
		
		this.cobs=[];
		for (var i = 0; i < array.length; ++i) {
			let founded:boolean = false;
			for (var k = 0; k <= this.cobs.length-1; ++k) {
				if (this.cobs[k]==array[i].campo6)
					founded = true;
			}
			if (!founded)
				this.cobs.push(array[i].campo6);
			else founded = false;
		}
	}

	// extraerServicios(array:turnosV0[]){
		
		//this.sers=[];
	// 	for (var i = 0; i <= array.length-1; ++i) {
	// 		let founded:boolean = false;
	// 		for (var k = 0; k <= this.sers.length-1; ++k) {
	// 			if (this.sers[k]==array[i].servicio)
	// 				founded = true;
	// 		}
	// 		if (!founded)
	// 			this.sers.push(array[i].servicio);
	// 		else founded = false;
	// 	}
	// }




	filter(){
		let doctorsTurns: turnosV0[] = [];
		this.filterDoctors(doctorsTurns);

		let datesTurns: turnosV0[] = [];
		this.filterDates(datesTurns,doctorsTurns);

		this.prepararArreglos(datesTurns); 
		this.extraerCoberturas(datesTurns);
		// this.extraerServicios(newTurns);
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

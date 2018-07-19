import { Injectable } from '@angular/core';
import { turnosV0, UserCredentials } from '../interfaces';


@Injectable()
export class MathsFunctions{
	
	constructor(){}


	public calculatePercentage(array: Array<any>, valueToCompare):number{
		let counter = 0;
		for (var i = 0; i <= array.length-1; i++) {
			if (array[i] == valueToCompare)
				counter++;
		}
		return parseFloat((counter * 100 / array.length).toFixed(2));
	}

	public count(array: Array<any>, valueToCompare){
		let counter = 0;
		for (var i = 0; i <= array.length-1; i++) {
			if (array[i] == valueToCompare)
				counter++;
		}
		return counter;
		
	}





	
	private turnsV0_array: Array<turnosV0>;

	//funciones estadisticas
	//demora medico
	private loadArrayM(array: Array<number>){
		for (var i = 0; i < this.turnsV0_array.length; ++i) {
			array[i] = this.turnsV0_array[i].campo4 - this.turnsV0_array[i].campo3; // aca tengo que suponer que el paciente nunca llega antes del turno?
		}
		return array;
	}

	public medicalDelay(){
		var array:Array<number>;
		return ( this.average( this.loadArrayM(array) ) );
	}

	//demora paciente
	private loadArrayP(array: Array<number>){
		for (var i = 0; i < this.turnsV0_array.length; ++i) {
			array[i] = this.turnsV0_array[i].campo3 - this.turnsV0_array[i].campo2; // aca tengo que suponer que el paciente nunca llega antes del turno?
		}
		return array;
	}

	public patientDelay(){
		var array:Array<number>;
		return ( this.average( this.loadArrayP(array) ) );
	}


	//promedio
	private average(array: Array<number>){ 
		var avg=0;
		for (var i = 0; i < array.length; ++i) {
			avg = avg + array[i];
		}
		avg = avg / array.length;
		return avg;
	}


}
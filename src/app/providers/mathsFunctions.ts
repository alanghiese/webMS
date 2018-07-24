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





	
	//funciones estadisticas
	
	avgDoctor(doctor: string, array: turnosV0[]){
		let aux: turnosV0[] = [];
		for (var i = 0; i < array.length; i++) {
			if (array[i].campo1 == doctor)
				aux.push(array[i]);
		}
		let avg = 0;
		for (var k = 0; k < aux.length; k++) {

			let hour = Math.abs(parseInt(aux[k].campo4.substr(0,1)) - parseInt(aux[k].fecha1.substr(0,1)))*60;
			let minuts = Math.abs(parseInt(aux[k].campo4.substr(3,4)) - parseInt(aux[k].fecha1.substr(3,4)));
			// console.log(minuts);
			if (hour == 60)
				hour = 0;
			
			avg = avg + hour + minuts;

		}
		return parseInt((avg / aux.length).toFixed(2));
	}


	avgPatient(doctor: string, array: turnosV0[]){
		let aux: turnosV0[] = [];
		for (var i = 0; i < array.length; i++) {
			if (array[i].campo1 == doctor)
				aux.push(array[i]);
		}
		let avg = 0;
		for (var k = 0; k < aux.length; k++) {

			let hour = Math.abs(parseInt(aux[k].campo4.substr(0,1)) - parseInt(aux[k].campo3.substr(0,1)))*60;
			let minuts = Math.abs(parseInt(aux[k].campo4.substr(3,4)) - parseInt(aux[k].campo3.substr(3,4)));
			// console.log(minuts);
			if (hour == 60)
				hour = 0;
			
			avg = avg + hour + minuts;

		}
		return parseInt((avg / aux.length).toFixed(2));
	}


}
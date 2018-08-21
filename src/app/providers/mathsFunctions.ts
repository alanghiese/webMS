import { turnosV0, UserCredentials } from '../interfaces';
import { SUBTOPIC } from '../constants';



export class MathsFunctions{
	
	constructor(){}

	
	//funciones estadisticas

	countWebTurns(doctor: string, array: turnosV0[]){
		let count: number = 0;
		for (var i = 0; i < array.length; i++) {
			if (array[i].campo1 == doctor){
				if (array[i].subTema == SUBTOPIC.WEB)
					count++;
			}
		}
		return count;
	}
	

	countDesktopTurns(doctor: string, array: turnosV0[]){
		let count: number = 0;
		for (var i = 0; i < array.length; i++) {
			if (array[i].campo1 == doctor){
				if (array[i].subTema == SUBTOPIC.DESKTOP)
					count++;
			}
		}
		return count;
	}


	avgDoctor(doctor: string, array: turnosV0[]){
		let aux: turnosV0[] = [];
		for (var i = 0; i < array.length; i++) {
			if (array[i].campo1 == doctor)
				aux.push(array[i]);
		}
		
		let avg:number = 0;
		for (var k = 0; k < aux.length; k++) {

			let minutsC2 = parseInt(aux[k].campo2.substr(0,2))*60 + parseFloat(aux[k].campo2.substr(3,5));
			let minutsC4 = parseInt(aux[k].campo4.substr(0,2))*60 + parseFloat(aux[k].campo4.substr(3,5));
			avg = avg + (minutsC2 - minutsC4);
		}
		let result = parseFloat((avg / aux.length).toFixed(2))*-1;
		if (result)
			return result;
		return 0;
	}


	avgPatient(doctor: string, array: turnosV0[]){

		let aux: turnosV0[] = [];
		for (var i = 0; i < array.length; i++) {
			if (array[i].campo1 == doctor)
				aux.push(array[i]);
		}
		let avg = 0;
		for (var k = 0; k < aux.length; k++) {

			let minutsC2 = parseInt(aux[k].campo2.substr(0,2))*60 + parseFloat(aux[k].campo2.substr(3,5));
			let minutsC3 = parseInt(aux[k].campo3.substr(0,2))*60 + parseFloat(aux[k].campo3.substr(3,5));
			avg = avg + (minutsC2 - minutsC3);

		}
		let result = parseFloat((avg / aux.length).toFixed(2))*-1;
		if (result)
			return result;
		return 0;
	}


}
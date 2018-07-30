import { turnosV0 } from '../interfaces';
import { nameAVG } from '../models/regNameAVG'
import { MathsFunctions } from '../providers/mathsFunctions'


export class prepareArrays{

	private turnsCompleteds: turnosV0[] = [];
	private delays: nameAVG[] = [];
	private math: MathsFunctions = new MathsFunctions();

	constructor(){}

	prepareArray(array: turnosV0[]): turnosV0[]{
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
		return this.turnsCompleteds;
	}

	prepareArrayDoctors(array:turnosV0[]){
		this.delays = [];
		let doctors: string[] = this.getDoctors(array);
		for (var i = 0; i < doctors.length; i++) {
			this.delays.push({name: doctors[i], avgDoctor: 0, avgPatient: 0, countWeb: 0, countDesktop: 0})
		}

		// console.log(this.delays)
	}

	getDoctors(array: turnosV0[]):string[]{
		let founded: boolean = false;
		let doctors: string[] = [];
		for (var i = 0; i < array.length; i++) {
			for (var k = 0; k < doctors.length; k++) {
				if (array[i].campo1 == doctors[k])
					founded = true;
			}
			if (!founded)
				doctors.push(array[i].campo1);
			founded = false;
			
		}
		return doctors;
	}

	doctorsAverage(fullTurns:turnosV0[]){
		// console.log(fullTurns);
		for (var i = 0; i < this.delays.length; i++) {
			this.delays[i].avgDoctor = this.math.avgDoctor(this.delays[i].name,fullTurns);
			this.delays[i].avgPatient = this.math.avgPatient(this.delays[i].name,fullTurns);
			this.delays[i].countWeb = this.math.countWebTurns(this.delays[i].name,fullTurns);
			this.delays[i].countDesktop = this.math.countDesktopTurns(this.delays[i].name,fullTurns);
		}
		this.delays.sort(
			function(a,b){
				if (b.name > a.name)
					return -1;
				else return 1;
			}
		);
		// console.log(this.delays)

	}

	getTurnsCompleteds(): turnosV0[]{
		return this.turnsCompleteds;
	}

	getDelays(): nameAVG[]{
		return this.delays;
	}


}
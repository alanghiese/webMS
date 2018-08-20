import { turnosV0, webVSdesktop } from '../interfaces';
import { nameAVG } from '../models/regNameAVG'
import { MathsFunctions } from '../providers/mathsFunctions'


export class prepareArrays{

	private turnsCompleteds: turnosV0[] = [];
	private delays: nameAVG[] = [];
	private math: MathsFunctions = new MathsFunctions();

	constructor(){}

	prepareArray(array: turnosV0[]): turnosV0[]{
		this.turnsCompleteds = [];
		this.delays = [];
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
			// if(array[k].campo3 != '' && array[k].campo4 != '')
				this.turnsCompleteds.push(array[k]);
		}
		// console.log('ARRAY EN EL prepareArrays');
		// console.log(this.turnsCompleteds);
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

	onlyCountWebDesktopTurns(fullTurns: turnosV0[]){
		let arr = [];
		// console.log('CANTIDAD DE TURNOS EN FULLTURNS');
		// console.log(fullTurns.length);
		// console.log('|||||||||||||||||||||||||||||||||||||||');
		for (var i = 0; i < this.delays.length; i++) {
			// let a: webVSdesktop;
			let a = {
				name: '',
				web: '',
				desktop: ''
			};
			// a = new webVSdesktop('',0,0);
			a.name = this.delays[i].name;
			a.web = this.math.countWebTurns(this.delays[i].name,fullTurns).toString();
			a.desktop = this.math.countDesktopTurns(this.delays[i].name,fullTurns).toString();
			// console.log('SUMA DE TURNOS PARA ' +  a.name);
			// console.log(a.web+a.desktop);
			// console.log('------------------------');
			arr.push(a);
		}
		// console.log('prepareArrays');
		// console.log(arr);
		arr.sort(
			function(a,b){
				if (b.name > a.name)
					return -1;
				else return 1;
			}
		);
		// console.log(arr);
// 
		return arr;
	}

	getTurnsCompleteds(): turnosV0[]{
		return this.turnsCompleteds;
	}

	getDelays(): nameAVG[]{
		return this.delays;
	}


}
import { turnosV0 } from '../interfaces';

export class Filter{
	constructor(
			public excludeSurname: string,
			public foundSurname: string,
			public selUntil: string,
			public selSince: string,
			public selService: string,
			public selPractice: string,
			public selCoverage: string,
			public selDoctor: string
		){}

	filter(original:turnosV0[]):turnosV0[]{
		let datesTurns: turnosV0[] = [];
		this.filterDates(datesTurns,original);//si no uso el estatico no deberia ser necesario esto

		
  		let doctorsTurns: turnosV0[] = [];

		this.filterDoctors(doctorsTurns,datesTurns);


		let servicesTurns: turnosV0[] = [];
		this.filterService(servicesTurns,doctorsTurns);

		let coveragesTurns: turnosV0[] = [];
		this.filterCoverages(coveragesTurns,servicesTurns);

		let excludeSurnameTurns: turnosV0[] = [];
		this.excludeSurnameF(excludeSurnameTurns,coveragesTurns);
		// console.log(excludeSurnameTurns.length);
		let includeSurnameTurns: turnosV0[] = [];
		this.includeSurname(includeSurnameTurns,excludeSurnameTurns);

		return includeSurnameTurns;
	}


	private filterDoctors(array: turnosV0[], full: turnosV0[]){
  		
  		if (this.selDoctor != ''){
			for (let k = 0; k < full.length ; k++) {
				if (full[k].campo1 == this.selDoctor){
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

  	private excludeSurnameF(array: turnosV0[], full: turnosV0[]){
  		
  		if (this.excludeSurname != ''){
			for (let k = 0; k < full.length ; k++) {
				if (full[k].nomUsuario.toUpperCase() != this.excludeSurname.toUpperCase()){
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

  	private includeSurname(array: turnosV0[], full: turnosV0[]){
  		
  		if (this.foundSurname != ''){
			for (let k = 0; k < full.length ; k++) {
				if (full[k].nomUsuario.toUpperCase() == this.foundSurname.toUpperCase()){
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

  	private filterService(array: turnosV0[], full: turnosV0[]){
  		

  		if (this.selService != ''){
			for (let k = 0; k < full.length ; k++) {
				// console.log(full[k].campo7)
				if (full[k].campo7.toUpperCase() == this.selService.toUpperCase())
					array.push(full[k]);
			}
		}
		else {
			for (let k = 0; k < full.length ; k++) {
				array.push(full[k]);
			}
		}
  	}

  	private filterCoverages(array: turnosV0[], full: turnosV0[]){
  		
  		let noCoverage = "SIN COBERTURA";
  		if (this.selCoverage == noCoverage){
			for (let k = 0; k < full.length ; k++) {
				if (full[k].campo6.toUpperCase() == "")
					array.push(full[k]);
			}
		}
  		
		else if (this.selCoverage != ''){
			for (let k = 0; k < full.length ; k++) {
				if (full[k].campo6.toUpperCase() == this.selCoverage.toUpperCase())
					array.push(full[k]);
			}
		}	
		else {
			for (let k = 0; k < full.length ; k++) {
				array.push(full[k]);
			}

		}

  	}

  	private filterDates(array,arrayToCompare:turnosV0[]){
		let since = this.convertToDate(this.selSince);
		let until = this.convertToDate(this.selUntil);
		
		since.setHours(0);
		since.setMilliseconds(0);
		since.setMinutes(0);
		since.setSeconds(0);
		until.setHours(23,59,59);

		for (let k = 0; k < arrayToCompare.length ; k++) {
			
			let date = new Date(arrayToCompare[k].fecha1);
			if (date >= since && date <= until)
				array.push(arrayToCompare[k]);
		}
	}

	private convertToDate(date:String):Date{
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
}
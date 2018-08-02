import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
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
	private backSince = null;
	private backUntil = null;
	private preparingTurns: boolean = false;
	private keepData: boolean = false;

	constructor(
		private appComponent: AppComponent, 
		private maths: MathsFunctions,
		private _router: Router,
		private _dbPetitions: DbPetitionsComponent
		){}

	ngOnInit() {
		let array: any;
		let from = this.convertToDate(this.appComponent.filter.selSince);
		let to = this.convertToDate(this.appComponent.filter.selUntil);
		if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false'){
        	this._router.navigate(['login']);
		}
    	else{
    		this.preparingTurns = true;
			this._dbPetitions.getStatistics(from, to).subscribe( (resp) => {
			// this._dbPetitions.getStatic().subscribe( (resp) => {
				array = resp;
				console.log('cargando datos en el arreglo...')
				if (resp){
					// console.log(array);
					console.log('cargado!');
					// console.log(resp);
					this.prepareArray(array);
					// console.log(this.turns);
					this.prepararArreglos(this.turns); 
					this.nameOfCoverages = this.appComponent.getCoverages();
					this.nameOfServices = this.appComponent.getServices();
					this.finalizeArrays();
					this.filterFunction();
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
	            

	          	alert(msg);
			});
    		}

    	
    	this.appComponent.setNotFilter(false);
        this.backSince = this.appComponent.filter.selSince;
        this.backUntil = this.appComponent.filter.selUntil;
		let backURL = this._router.url;
		localStorage.setItem('url', backURL);
		clearInterval(this.appComponent.interval);


	}
	prepareArray(array: turnosV0[]){
		this.turns = [];
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

		for (let k = 0; k < intC ; k++)
			this.turns.push(array[k]);		
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
			this.allServices[i] = array[i].campo7;
		}
	}


	

	private userPersentage: string = '';
	private stackP: boolean = true;
	finalizeArrays(){
		this.finalCoverage = [];
		this.finalService = [];
		let sumP = 0;
		let sumC = 0;

		for (var i=0; i<this.nameOfCoverages.length; i++){
			let t = new tuple('',0,0);
			t.name = this.nameOfCoverages[i];
			t.percentage = this.maths.calculatePercentage(this.allCoverages,this.nameOfCoverages[i]);
			t.count = this.maths.count(this.allCoverages,this.nameOfCoverages[i]);
			sumC = sumC + t.count;
			sumP = sumP + t.percentage
			if (t.count != 0)
				this.finalCoverage.push(t);
		}

		

		for (var k=0; k<this.nameOfServices.length; k++){
			let t = new tuple('',0,0);
			t.name = this.nameOfServices[k];
			t.percentage = this.maths.calculatePercentage(this.allServices,this.nameOfServices[k]);
			t.count = this.maths.count(this.allServices,this.nameOfServices[k]);
			if (t.count != 0)
				this.finalService.push(t);
		}

		if (this.finalCoverage.length>0)
			this.finalCoverage.sort(
				function(a,b){
					return b.percentage - a.percentage;
				}
			);

		if (this.finalService.length>0)
			this.finalService.sort(
				function(a,b){
					return b.percentage - a.percentage;
				}
			);

		let t = new tuple('Sin cobertura', parseFloat((100 - sumP).toFixed(2)), this.getNumberOfTurns() - sumC);
		this.finalCoverage.push(t);


		if (this.stackP){
			let coverageCeil = 0;
			let serviceCeil = 0;
			if (this.finalCoverage.length>1)
				coverageCeil = Math.ceil(this.finalService[Math.floor(this.finalService.length/2)].percentage);
			if (this.finalService.length>1)
				serviceCeil = Math.ceil(this.finalService[Math.floor(this.finalService.length/2)].percentage);

			if (this.userPersentage != ''){
				coverageCeil = parseFloat(this.userPersentage);
				serviceCeil  = parseFloat(this.userPersentage);
			}
			if (this.finalService.length > 1)
			this.stackPercentages(coverageCeil,serviceCeil);
		}
	}

	stackPercentages(coverageCeil,serviceCeil){
		let arrAux = this.finalCoverage;
		let percentageAux = 0;
		let countAux = 0;
		if (this.finalCoverage.length > 1){
			this.finalCoverage = [];
			for (var i = 0; i < arrAux.length; i++) {
				if (arrAux[i].percentage >= coverageCeil){
					this.finalCoverage.push(arrAux[i]);
				}
				else{
					percentageAux = percentageAux + arrAux[i].percentage;
					countAux = countAux + arrAux[i].count;	
				}
			}
			this.finalCoverage.push(new tuple('Turnos con porcentajes menores a '+coverageCeil+'%',parseFloat(percentageAux.toFixed(2)),countAux));
		}
		arrAux = this.finalService;
		percentageAux = 0;
		countAux = 0;
		if (this.finalService.length > 1){
			this.finalService = [];
			for (var i = 0; i < arrAux.length; i++) {
				if (arrAux[i].percentage >= serviceCeil){
					this.finalService.push(arrAux[i]);
				}
				else{
					percentageAux = percentageAux + arrAux[i].percentage;
					countAux = countAux + arrAux[i].count;	
				}
			}
			this.finalService.push(new tuple('Turnos con porcentajes menores a '+serviceCeil+'%',percentageAux,countAux));
		}
	}

	//filtrar
  	filter(){
  		if (this.backSince != this.appComponent.filter.selSince || this.backUntil != this.appComponent.filter.selUntil){
  			this.preparingTurns = true;
	  		// this._dbPetitions.getStatic().subscribe((resp)=>{ //sacar si uso la peticion en tiempo real
	  		this._dbPetitions.getStatistics(this.convertToDate(this.appComponent.filter.selSince),
  									this.convertToDate(this.appComponent.filter.selUntil)
  			).subscribe((resp)=>{
	        		if (resp){
	        			// console.log(resp)
	        			this.prepareArray(resp);
	        			// console.log(this.turnsCompleteds);

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
	            

	          	alert(msg);
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
		let backCoverages: any[] = [];
		let backServices: any[] = [];
		if (this.keepData){
			backCoverages = this.allCoverages;
			backServices = this.allServices;
		}
		
		let arraySol = this.appComponent.filter.filter(this.turns);

		this.prepararArreglos(arraySol); 
		// console.log(this.keepData)
		if (this.keepData){
			for (var i = 0; i < backCoverages.length; i++) {
				this.allCoverages.push(backCoverages[i]);
			}
			for (var i = 0; i < backServices.length; i++) {
				this.allServices.push(backServices[i]);
			}
		}


		this.finalizeArrays();


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

	turnsReady(){
		return !this.preparingTurns;
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

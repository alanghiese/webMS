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
					this.prepareArray(array);
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

	prepareArray(array){
		let c: string;
		for (var i in array) {
			if (parseInt(i))
				c = i;
		}
		let intC = parseInt(c);
		// console.log(c);

		for (let k = 0; k < intC; k++) {
			// console.log(array[k]);
			this.turns.push(array[k]);
		}
	}
	

	prepararArreglos(array:turnosV0[]){
		for (var i = 0; i <= this.turns.length-1; ++i) {
			this.cob[i] = array[i].campo6;
			// this.ser[i] = array[i].servicio;
		}
	}

	extraerCoberturas(array:turnosV0[]){
		for (var i = 0; i <= array.length-1; ++i) {
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
		console.log(this.appComponent.filter);
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

import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { UPPERCASE } from '../../pipes/toUpperCase.pipe';
import { MathsFunctions } from '../../providers/mathsFunctions'
import { Router } from '@angular/router';


import { DbPetitionsFalseComponent } from '../../providers/dbPetitionsFalse'//datos falsos
import { falseUser } from '../../models/falseUser'//datos falsos
import { datos } from '../../models/falseDatos' //datos falsos

@Component({
  selector: 'turns',
  templateUrl: './turns.component.html',
  styleUrls: ['./turns.component.css'],
  providers: [ DbPetitionsFalseComponent, MathsFunctions ]
})
export class TurnsComponent implements OnInit {

	private valueGroupBy: any = "Cobertura";

//datos falsos
	private datoss: datos[] = [];
	private cob:string[] = [];
	private ser:string[] = [];
	private cobs: string[] = [];
	private sers: string[] = [];
// fin de datos falsos

	constructor(
		private appComponent: AppComponent, 
		private _DbPetitionsFalseComponent: DbPetitionsFalseComponent, 
		private maths: MathsFunctions,
		private _router: Router
		){}
	
	array: any;
	ngOnInit() {
		this._DbPetitionsFalseComponent.get().subscribe( (resp) => {
			this.array = resp;
			// console.log(this.array)
			if (resp){
				this.prepararArreglo(this.array);//datos falsos
				// console.log(this.datoss);
				this.prepararArreglos(); //datos falsos
				this.extraerCoberturas();//datos falsos
				this.extraerServicios();//datos falsos
				
			}
		});
		if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
        this._router.navigate(['login']);


	}


	//zona falsa
	prepararArreglo(array: Array<falseUser>){//datos falsos
		for (var i = 0; i <= array.length-1; ++i) {
			let now = new Date();
			let a: datos = {
				id: array[i].id,
				name: array[i].name,
				username: array[i].username,
				email: array[i].email,
				cobertura:  Math.round((Math.random()*10)/3+1),//en lugar de 3 iria la cantidad de cpbertura/servicios que haya
				fecha: now.getDay() + '/' + now.getMonth() + '/' + now.getFullYear(),
				servicio:  Math.round((Math.random()*10)/3+1)//en lugar de 3 iria la cantidad de cpbertura/servicios que haya
			}
			this.datoss[i] = a;
		}
	}

	prepararArreglos(){//datos falsos
		for (var i = 0; i <= this.datoss.length-1; ++i) {
			this.cob[i] = this.datoss[i].cobertura;
			this.ser[i] = this.datoss[i].servicio;
		}
	}

	extraerCoberturas(){//datos falsos
		for (var i = 0; i <= this.datoss.length-1; ++i) {
			let founded:boolean = false;
			for (var k = 0; k <= this.cobs.length-1; ++k) {
				if (this.cobs[k]==this.datoss[i].cobertura)
					founded = true;
			}
			if (!founded)
				this.cobs.push(this.datoss[i].cobertura);
			else founded = false;
		}
	}

	extraerServicios(){//datos falsos
		for (var i = 0; i <= this.datoss.length-1; ++i) {
			let founded:boolean = false;
			for (var k = 0; k <= this.sers.length-1; ++k) {
				if (this.sers[k]==this.datoss[i].servicio)
					founded = true;
			}
			if (!founded)
				this.sers.push(this.datoss[i].servicio);
			else founded = false;
		}
	}

//fin de zona falsa

	filter(){
		console.log(this.appComponent.filter);
	}

	onChangeGroupBy(value:any){
		this.valueGroupBy = value;
	}

	all():boolean{
		return this.valueGroupBy == "Todo";
	}

	coverage():boolean{
		return this.valueGroupBy == "Cobertura";
	}

	service():boolean{
		return this.valueGroupBy == "Servicio";
	}
}

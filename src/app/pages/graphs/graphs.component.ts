import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { I18n, CustomDatepickerI18n } from '../../providers/CustomDatepickerI18n';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../app.component';



import { turnosV0, UserCredentials } from '../../interfaces';

const now = new Date();

@Component({
  selector: 'graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // define custom Ng
})
export class GraphsComponent implements OnInit {

	private param: string = 'Nombre por defecto';
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private appComponent: AppComponent
	){
		this.param = null;
	}

	ngOnInit() {
		this._route.params.forEach((params: Params) => {
			this.param = params['param'];
			if (this.param && !(this.param == 'temporal' || this.param == 'turns'))
				this._router.navigate(['/notfound']);
		});
	}


	private doctor: boolean = false;
	private patient: boolean = false;
	private turnsV0_array: Array<turnosV0>;

	//para graficos temporales

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
	public average(array: Array<number>){ 
		var avg=0;
		for (var i = 0; i < array.length; ++i) {
			avg = avg + array[i];
		}
		avg = avg / array.length;
		return avg;
	}



	//funciones booleanas para comparar que tipo de grafico voy a tener que mostrar

	public getTurn():boolean{
		return this.param == 'turns'
	}

	public getTemporal():boolean{
		return this.param == 'temporal'
	}


	//funcionalidades de los botones
	public clickDraw(){

		//dibujar dependiendo la opcion elegida
		if (this.doctor){
			
		}
		else if (this.patient){

		}
	}


	public clickDoctor(){
		this.doctor = !this.doctor;
		this.patient = false;
	}

	public clickPatient(){
		this.patient = !this.patient;
		this.doctor = false;
	}



	public getPatient(): boolean{
		return this.patient;
	}


	public getDoctor(): boolean{
		return this.doctor;
	}


	
  	//filtrar
  	filter(){
  		console.log(this.appComponent.filter);
  	}

	//para graficos de turnos

	public barChartOptions:any = {
	    scaleShowVerticalLines: false,
	    responsive: true
	};
	public barChartLabels:string[] = ['Doctor1', 'Doctor2'];
	public barChartType:string = 'bar';
	public barChartLegend:boolean = true;

	public barChartData:any[] = [
		{data: [40, 22], label: 'Turnos ofrecidos'},
		{data: [43, 31], label: 'Turnos tomados'}
	];

	// events
	public chartClicked(e:any):void {
		console.log(e);
	}

	public chartHovered(e:any):void {
		console.log(e);
	}
 

}

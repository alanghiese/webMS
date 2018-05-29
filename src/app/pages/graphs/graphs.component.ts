import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { I18n, CustomDatepickerI18n } from '../../providers/CustomDatepickerI18n';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DbPetitionsComponent } from '../../providers/dbPetitions'


import { turnosV0, UserCredentials } from '../../interfaces';

const now = new Date();

@Component({
  selector: 'graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}, DbPetitionsComponent] // define custom Ng
})
export class GraphsComponent implements OnInit {

	private param: string = 'Nombre por defecto';
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _DbPetitionsComponent: DbPetitionsComponent

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
	private draw: boolean = false;
	private modelSince: NgbDateStruct = {day: 1, month: now.getMonth() + 1, year: now.getFullYear() };
	private modelUntil: NgbDateStruct = {day: 1, month: now.getMonth() + 2, year: now.getFullYear() };
	private doctorSelected: String = 'Ninguno';
	private type = "0";
	private turnsV0_array: Array<turnosV0>;
	private account: UserCredentials = {
				enrollmentId: '',
				password: ''
			};

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
	public chooseDoctor():boolean{
		return this.type == "3" || this.type == "4";
	}
	public oneDay():boolean{
		return this.type == "1" || this.type == "3";
	}

	public anySel():boolean{
		return this.type == "0";
	}

	public getTurn():boolean{
		return this.param == 'turns'
	}

	public getTemporal():boolean{
		return this.param == 'temporal'
	}


	//funcionalidades de los botones
	public clickDraw(){
		this.draw = !this.draw;


		


		//dibujar dependiendo la opcion elegida
		if (this.doctor){
			
		}
		else if (this.patient){

		}
	}


	public change(value:any){
		this.draw = false;
		this.type = value;
	}

	public clickDoctor(){
		this.clear();
		this.doctor = !this.doctor;
		this.patient = false;
		this.draw = false;
		this.type = "0";
	}

	public clickPatient(){
		this.clear();
		this.patient = !this.patient;
		this.doctor = false;
		this.draw = false;
		this.type = "0";
	}

	public clear(){
		this.patient = false;
		this.doctor = false;
		this.type = "0";
		this.modelSince= { day: 1, month: now.getMonth() + 1, year: now.getFullYear() };
		this.modelUntil= { day: 1, month: now.getMonth() + 2, year: now.getFullYear() };
	}

	public getDraw(): boolean{
		return this.draw;
	}

	public getPatient(): boolean{
		return this.patient;
	}


	public getDoctor(): boolean{
		return this.doctor;
	}


	//seteo el valor del doctor 
	public onChange(value:String){
  		this.doctorSelected = value;
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

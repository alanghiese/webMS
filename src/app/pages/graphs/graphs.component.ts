import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { I18n, CustomDatepickerI18n } from '../../providers/CustomDatepickerI18n';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../app.component';



import { UserCredentials } from '../../interfaces';

const now = new Date();

@Component({
  selector: 'graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // define custom Ng
})
export class GraphsComponent implements OnInit {

	private param: string = 'Nombre por defecto';
	private doctor: boolean = false;
	private patient: boolean = false;

	
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



	//funciones booleanas para comparar que tipo de grafico voy a tener que mostrar

	public getTurn():boolean{
		return this.param == 'turns'
	}

	public getTemporal():boolean{
		return this.param == 'temporal'
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

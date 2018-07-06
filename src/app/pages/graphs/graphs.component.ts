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
	private graphtype: string = '1';

	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private appComponent: AppComponent
	){
		this.param = null;
	}

	ngOnInit() {
		if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
        	this._router.navigate(['login']);
	}
	

	

	
  	//filtrar
  	filter(){
  		console.log(this.appComponent.filter);
  	}



	//funciones booleanas para comparar que tipo de grafico voy a tener que mostrar

	isTemp():boolean{
		return this.graphtype == '0';
	}

	isDoctorDelay():boolean{
		return this.graphtype == '1';
	}

	isPatientDelay():boolean{
		return this.graphtype == '2';
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

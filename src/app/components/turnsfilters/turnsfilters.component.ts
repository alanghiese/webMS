import { Component, OnInit } from '@angular/core';
import { I18n, CustomDatepickerI18n } from '../../providers/CustomDatepickerI18n'
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


const now = new Date();

@Component({
  selector: 'turnsfilters',
  templateUrl: './turnsfilters.component.html',
  styleUrls: ['./turnsfilters.component.css'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // define custom Ng
})
export class TurnsfiltersComponent implements OnInit {

	constructor(){}
	ngOnInit(){}

  	//Hasta
	modelUntil: NgbDateStruct = {day: 1, month: now.getMonth() + 2, year: now.getFullYear() };
	selUntil: any = this.modelUntil.day + '/' + this.modelUntil.month + '/' + this.modelUntil.year;
	onChangeUntil(value: Date) {
		this.selUntil = this.modelUntil.day + '/' + this.modelUntil.month + '/' + this.modelUntil.year;

	}





	//Desde
	modelSince: NgbDateStruct = {day: 1, month: now.getMonth() + 1, year: now.getFullYear() };
	selSince: any = this.modelSince.day + '/' + this.modelSince.month + '/' + this.modelSince.year;
	onChangeSince(value: any) {
		this.selSince = this.modelSince.day + '/' + this.modelSince.month + '/' + this.modelSince.year;
	}




	//Servicio
	selService: String = "Ninguno";
	onChangeService(value: any) {
		this.selService = value;
	}



	//Cobertura
	selCoverage: String = "Ninguno";
	onChangeCoverage(value: any) {
		this.selCoverage = value;
	}


	//Doctor
	selDoctor: String = "Ninguno";
	onChangeDoctor(value: any) {
		this.selDoctor = value;
	}


	//filtra la lista de turnos
	public filterList(){
	//de momento nada
		console.log('                 ' +
					this.selUntil + '       ' +
					this.selSince + '       ' +
					this.selService + '       ' +
					this.selCoverage + '       ' +
					this.selDoctor
		);
	}

}

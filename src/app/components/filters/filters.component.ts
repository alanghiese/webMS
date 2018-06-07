import { Component, OnInit } from '@angular/core';
import { I18n, CustomDatepickerI18n } from '../../providers/CustomDatepickerI18n';
import { NgbDateCustomParserFormatter } from '../../providers/NgbDateCustomParserFormatter';
import { NgbDatepickerI18n, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../app.component'



const now = new Date();

@Component({
  selector: 'filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
  providers: [
  			I18n, 
  			{provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}, 
  			{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}] // define custom Ng
})
export class FiltersComponent implements OnInit {


  	modelSince: NgbDateStruct = {day: 1, month: now.getMonth() + 1, year: now.getFullYear() };
	modelUntil: NgbDateStruct// = {day: 0, month: now.getMonth() + 2, year: now.getFullYear() };



  constructor(private appComponent: AppComponent) { 
  	var lastDay = this.lastday(now.getFullYear(),now.getMonth());


	this.modelUntil = {day: lastDay, month: now.getMonth() + 1, year: now.getFullYear() };

  	this.appComponent.filter.selUntil = this.modelUntil.day + '/' + this.modelUntil.month + '/' + this.modelUntil.year;
  	this.appComponent.filter.selSince = this.modelSince.day + '/' + this.modelSince.month + '/' + this.modelSince.year;
  }

	lastday (y,m){
		return  new Date(y, m +1, 0).getDate();
	}
	

  ngOnInit() {}

  	// excludeSurname: string = '';
  	// foundSurname: string = '';

  //Hasta
	onChangeUntil(value: Date) {
		this.appComponent.filter.selUntil = this.modelUntil.day + '/' + this.modelUntil.month + '/' + this.modelUntil.year;

	}





	//Desde
	
	onChangeSince(value: any) {
		this.appComponent.filter.selSince = this.modelSince.day + '/' + this.modelSince.month + '/' + this.modelSince.year;
	}




	//Servicio
	// selService: String = "Ninguno";
	onChangeService(value: any) {
		this.appComponent.filter.selService = value;
	}

	//Practice
	// selPractice: String = "Ninguno";
	onChangePractice(value: any) {
		this.appComponent.filter.selPractice = value;
	}



	//Cobertura
	// selCoverage: String = "Ninguno";
	onChangeCoverage(value: any) {
		this.appComponent.filter.selCoverage = value;
	}


	//Doctor
	// selDoctor: String = "Ninguno";
	onChangeDoctor(value: any) {
		this.appComponent.filter.selDoctor = value;
	}

	setData(){
		console.log(this.appComponent.filter);
	}
	

}

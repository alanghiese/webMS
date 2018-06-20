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



  	validDate():boolean{

  		if (this.modelSince.year == this.modelUntil.year){
  			if (this.modelSince.month == this.modelUntil.month){
  				if (this.modelSince.day == this.modelUntil.day)
  					return true;
  				else return this.modelSince.day < this.modelUntil.day;
  			}
  			else return this.modelSince.month < this.modelUntil.month;

  		}
  		else return this.modelSince.year < this.modelUntil.year;
	}

  	//Hasta
	onChangeUntil(value: Date) {
		this.appComponent.filter.selUntil = this.modelUntil.day + '/' + this.modelUntil.month + '/' + this.modelUntil.year;

	}


	//Desde
	
	onChangeSince(value: any) {
		this.appComponent.filter.selSince = this.modelSince.day + '/' + this.modelSince.month + '/' + this.modelSince.year;
	}




	//Servicio
	onChangeService(value: any) {
		this.appComponent.filter.selService = value;
	}

	//Practice
	onChangePractice(value: any) {
		this.appComponent.filter.selPractice = value;
	}



	//Cobertura
	onChangeCoverage(value: any) {
		this.appComponent.filter.selCoverage = value;
	}


	//Doctor
	onChangeDoctor(value: any) {
		this.appComponent.filter.selDoctor = value;
	}

	setData(){
		console.log(this.appComponent.filter);
	}
	

}

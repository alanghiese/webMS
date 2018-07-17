import { Component, OnInit } from '@angular/core';
import { I18n, CustomDatepickerI18n } from '../../providers/CustomDatepickerI18n';
import { NgbDateCustomParserFormatter } from '../../providers/NgbDateCustomParserFormatter';
import { NgbDatepickerI18n, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../app.component';
import { DbPetitionsComponent } from '../../providers/dbPetitions';



const now = new Date();

@Component({
  selector: 'filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
  providers: [
  			I18n, 
  			{provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}, 
  			{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter},// define custom Ng
  			DbPetitionsComponent] 
})
export class FiltersComponent implements OnInit {


  	modelSince: NgbDateStruct = {day: 1, month: now.getMonth() + 1, year: now.getFullYear() };
	modelUntil: NgbDateStruct// = {day: 0, month: now.getMonth() + 2, year: now.getFullYear() };
	private doctors:any = null;
	private services:any = null;
  private coverages:any = null;

	constructor(
		private appComponent: AppComponent, 
		private _DbPetitionsComponent: DbPetitionsComponent){ 

	  	var lastDay = this.lastday(now.getFullYear(),now.getMonth());
		this.modelUntil = {day: lastDay, month: now.getMonth() + 1, year: now.getFullYear() };
	  	this.appComponent.filter.selUntil = this.modelUntil.year + '-' + this.modelUntil.month + '-' + this.modelUntil.day;
	  	this.appComponent.filter.selSince = this.modelSince.year + '-' + this.modelSince.month + '-' + this.modelSince.day;
  	}

	lastday (y,m){
		return  new Date(y, m +1, 0).getDate();
	}

	
  	ngOnInit() {
  		localStorage.setItem('reload','false');
  		this.doctors = this.appComponent.getDoctors();
  		this.services = this.appComponent.getServices();
      this.coverages = this.appComponent.getCoverages();
      if (!this.coverages)
        this.coverages = [];
  		if (!this.doctors)
  			this.doctors = [];
  		if (!this.services)
  			this.services = [];
  	}


  	//para cuando cambia de usuario
  	reload(){
  		this._DbPetitionsComponent.getDoctors('').subscribe(
  		(resp)=>{
  			// if (resp)
  			// 	console.log(resp);
  			// else
  			// 	console.log('doctors don\'t work'); 
  			this.doctors = resp.data;
  		});

  		this._DbPetitionsComponent.getServices().subscribe(
  		(resp)=>{
  			// if (resp)
  			// 	console.log(resp);
  			// else
  			// 	console.log('services don\'t work');
  			this.services = resp.data;
  		});
  	}

  	needReload():boolean{
  		if (localStorage.getItem('reload') == 'true'){
  			this.reload();
  			localStorage.setItem('reload','false');
  		}
  		return true;
  	}


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
		this.appComponent.filter.selUntil = this.modelUntil.year + '-' + this.modelUntil.month + '-' + this.modelUntil.day;

	}


	//Desde
	onChangeSince(value: any) {
		this.appComponent.filter.selSince = this.modelSince.year + '-' + this.modelSince.month + '-' + this.modelSince.day;
	}




	//Servicio
	onChangeService(value: any) {
		if (value=='Ninguno')
			this.appComponent.filter.selService = ''
		else
			this.appComponent.filter.selService = value;
	}

	//Practice
	onChangePractice(value: any) {
		if (value=='Ninguno')
			this.appComponent.filter.selPractice = ''
		else
			this.appComponent.filter.selPractice = value;
	}



	//Cobertura
	onChangeCoverage(value: any) {
		if (value=='Ninguno')
			this.appComponent.filter.selCoverage = ''
		else
			this.appComponent.filter.selCoverage = value;
	}


	//Doctor
	onChangeDoctor(value: any) {
		if (value=='Ninguno')
			this.appComponent.filter.selDoctor = ''
		else
			this.appComponent.filter.selDoctor = value;
	}

	setData(){
		console.log(this.appComponent.filter);
	}
	

}

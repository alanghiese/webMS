import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import { DbPetitionsComponent } from '../../providers/dbPetitions';
import { turnosV0, webVSdesktop } from '../../interfaces';
import { nameAVG } from '../../models/regNameAVG';
import { prepareArrays } from '../../providers/prepareArrays';
import { STATE_TURN,SUBTOPIC,PAGES,ANYBODY } from '../../constants';
import { ExcelService } from '../../providers/excel.services';
import { UserCredentials } from '../../interfaces';

const now = new Date();

@Component({
  selector: 'graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css'],
  providers: [ ExcelService ]
})
export class GraphsComponent implements OnInit {


	private graphtype: string = '1';
	private turnsCompleteds: turnosV0[] = [];
	private newTurnsFilter: turnosV0[] = [];
	private delays: nameAVG[] = [];
	private delaysWithStateFilter: nameAVG[] = [];
	private keepData: boolean = false;
	private backSince = null;
	private backUntil = null;
	private preparingTurns: boolean = false;		
	private totalDelays: number = 0;
	private totalOthers: number = 0;
	private showTableB: boolean = false;
	private stack = false;
	private prepareArrays: prepareArrays;
	private webVSdesktopArr: webVSdesktop[] = [];
	private attendedWeb: any[] = [];
	private attendedDesktop: any[] = [];
	private combinedDataWeb: any[] = [];
	private combinedDataDesktop: any[] = [];
	private arraySol: turnosV0[] = []; //array para los datos de los delays
	private arrayPatients: turnosV0[] = []; //para el modal de los delays

	private nameButton = "Nadie";

	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private appComponent: AppComponent,
		private dbPetitions: DbPetitionsComponent,
		private excelService:ExcelService
	){}

	ngOnInit() {
		// this.appComponent.setNotFilter(false);
    this.appComponent.filterVisibility('visible');
		let backURL = this._router.url;
		// localStorage.setItem('url', backURL);
		
		clearTimeout(this.appComponent.interval);
		this.prepareArrays = new prepareArrays();
		let preparingTurns1 = true;
		let preparingTurns2 = true;

		if (localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'false')
        	this._router.navigate([PAGES.LOGIN]);
        else{
        	console.log('cargando turnos...');	
        	this.preparingTurns = true;
    //     	this.dbPetitions.getTurnsDoctors(this.convertToDate(this.appComponent.filter.selSince),
    //     									this.convertToDate(this.appComponent.filter.selUntil)
    //     	).subscribe((turnsD)=>{
    //     		if (turnsD){
    //     			// console.log(turnsD);
    //     			let sizeString:string = turnsD.data.msg;
    //     			let index = sizeString.indexOf(' ');
    //     			let size: number = parseInt(sizeString.substr(0,index));
    //     			// console.log(size);
    //     			// this.filterTemp();




        			preparingTurns2 = false;
        			this.preparingTurns = preparingTurns1;
    //     		}

    //     	},
    //     	(err)=>{
				// let msg = 'Ups! Algo salió mal, intente de nuevo';
	   //        	if (err.message.includes('session expired')){
	   //        		msg = 'Debe volver a iniciar sesion';
	   //        		localStorage.setItem('logged','false');
	   //        		this._router.navigate(['login']);
	   //        	}
	   //        	});
        	


        	let from = this.convertToDate(this.appComponent.filter.selSince);
        	let to = this.convertToDate(this.appComponent.filter.selUntil);
        	from.setHours(0);
			from.setMilliseconds(0);
			from.setMinutes(0);
			to.setHours(0);
			to.setMilliseconds(0);
			to.setMinutes(0);

        	this.dbPetitions.getStatistics(from,to).subscribe((resp)=>{
        	// this.dbPetitions.getStatic().subscribe((resp)=>{ //sacar si uso la peticion en tiempo real
        		if (resp){
        			// console.log(resp);
        			this.prepareArrays.prepareArray(resp);
        			this.turnsCompleteds = this.prepareArrays.getTurnsCompleteds();        			
        			// console.log(this.turnsCompleteds);
        			this.prepareArrays.prepareArrayDoctors(this.turnsCompleteds);
        			this.prepareArrays.doctorsAverage(this.turnsCompleteds);
	        		this.delays = this.prepareArrays.getDelays();
	        		// console.log(this.delays);
	        		this.webVSdesktopArr = this.prepareArrays.onlyCountWebDesktopTurns(this.turnsCompleteds);
	        		

	        		this.filterFunction();

        			// this.prepareGraphicDelay(this.delays);
					// this.prepareGraphicTurns();

        			preparingTurns1 = false;
        			this.preparingTurns = preparingTurns2;
        		}
        	},
        	(err)=>{
				let msg = 'Ups! Algo salió mal, intente de nuevo';
	          	if (err.message.includes('session expired')){
	          		msg = 'Debe volver a iniciar sesion';
	          		localStorage.setItem('logged','false');
	          		this._router.navigate([PAGES.LOGIN]);
	          	}
	            

	          	alert(msg);
			});

        }
        
        this.backSince = this.appComponent.filter.selSince;
        this.backUntil = this.appComponent.filter.selUntil;
        
		
	}

	turnsReady():boolean{
		return !this.preparingTurns;
	}
	
	exportAsXLSX():void {
		
		let arrayExcel = [{
			nombre_paciente: '',
			fecha_turno: '',
			hora_turno: '',
			hora_llegada: '',
			hora_atencion: ''
		}];


		for (var i = 0; i < this.arrayPatients.length; i++) {
			arrayExcel[i].nombre_paciente = this.arrayPatients[i].nomUsuario;
			arrayExcel[i].fecha_turno = this.arrayPatients[i].fecha1;
			arrayExcel[i].hora_turno = this.arrayPatients[i].campo2;
			arrayExcel[i].hora_llegada = this.arrayPatients[i].campo3;
			arrayExcel[i].hora_atencion = this.arrayPatients[i].campo4;

		}

		this.excelService.exportAsExcelFile(arrayExcel, 'Turnos de pacientes');
	}


	hideOrShowTable(){
		this.showTableB = !this.showTableB;
	}

	showTable(){
		return this.showTableB;
	}




	
  	//filtrar
  	filter(){
  		
  		if (this.backSince != this.appComponent.filter.selSince || this.backUntil != this.appComponent.filter.selUntil){
  			this.preparingTurns = true;
	  		// this.dbPetitions.getStatic().subscribe((resp)=>{ //sacar si uso la peticion en tiempo real
	  		this.dbPetitions.getStatistics(this.convertToDate(this.appComponent.filter.selSince),
  									this.convertToDate(this.appComponent.filter.selUntil)
  		).subscribe((resp)=>{
	        		if (resp){
	        			// console.log(resp)
	        			this.prepareArrays.prepareArray(resp);
	        			// console.log(this.turnsCompleteds);
	        			this.turnsCompleteds = this.prepareArrays.getTurnsCompleteds();
	        			this.delays = this.prepareArrays.getDelays();
	        			this.filterFunction();
	        			this.backSince = this.appComponent.filter.selSince;
	        			this.backUntil = this.appComponent.filter.selUntil;
	        			this.preparingTurns = false;

	        		}
	        	},
        		(err)=>{
					let msg = 'Ups! Algo salió mal, intente de nuevo';
		          	if (err.message.includes('session expired')){
		          		msg = 'Debe volver a iniciar sesion';
		          		localStorage.setItem('logged','false');
		          		this._router.navigate([PAGES.LOGIN]);
		          	}
	          	});
  		}
	  	else{
	  		this.preparingTurns = true;
	  		this.filterFunction();
	  		this.preparingTurns = false;
	  	}

  		// console.log(this.appComponent.filter);
  	}

  	 

  	filterFunction(){
  		//FILTROS
		let backDelays: any[] = [];
		if (this.keepData)
			backDelays = this.delays;
		
		let turnsAttended =  this.filterNewTurns(this.turnsCompleteds);
    	this.arraySol = this.appComponent.filter.filter(turnsAttended);

		this.prepareArrays.prepareArrayDoctors(this.arraySol);
		this.prepareArrays.doctorsAverage(this.arraySol);
	    this.delays = this.prepareArrays.getDelays();

		if (this.keepData)
			for (var i = 0; i < backDelays.length; i++) {
				if (!this.contains(this.delays, backDelays[i]))
					this.delays.push(backDelays[i]);
			}
		this.prepareGraphicDelay(this.delays);




		let backDelaysState = this.delaysWithStateFilter;
		let turnsCompletedsWithStateFilter = this.appComponent.filter.filterState(this.turnsCompleteds);
		this.newTurnsFilter = this.appComponent.filter.filter(turnsCompletedsWithStateFilter);

		this.prepareArrays.prepareArrayDoctors(this.newTurnsFilter);
		this.prepareArrays.doctorsAverage(this.newTurnsFilter);
	    this.delaysWithStateFilter = this.prepareArrays.getDelays();

	    this.webVSdesktopArr = this.prepareArrays.onlyCountWebDesktopTurns(this.newTurnsFilter);

	    if (this.keepData)
			for (var i = 0; i < backDelaysState.length; i++) {
				if (!this.contains(this.delaysWithStateFilter, backDelaysState[i]))
					this.delays.push(backDelaysState[i]);
			}

	    
		this.prepareGraphicTurns(this.delaysWithStateFilter);
		this.getStatesOfTurns(this.newTurnsFilter);







		if (this.keepData){
			this.totalDelays = this.totalDelays + this.arraySol.length;
			this.totalOthers = this.totalOthers + turnsCompletedsWithStateFilter.length;
		}
		else{
			this.totalDelays = this.arraySol.length;
			this.totalOthers = this.newTurnsFilter.length;
		}
  	}

  	contains(array: nameAVG[], valueToCompare: nameAVG){
  		let founded = false;
  		for (var i = 0; i < array.length; i++) {
  			if (array[i].name.toUpperCase() == valueToCompare.name.toUpperCase())
  				founded = true;
  		}
  		return founded;
  	}

  	filterNewTurns(array: turnosV0[]): turnosV0[]{
	    let arr: turnosV0[] = [];
	    for (var i = 0; i < array.length; i++) {
	      if(array[i].campo3 != '' && array[i].campo4 != '')
	        arr.push(array[i]);
	    }
	    return arr;
    
  	}
  	
	convertToDate(date:String):Date{
		// console.log(date);
		let d = new Date();
		//YYYY-MM-DD
		let second = date.lastIndexOf('-');
		let first = date.indexOf('-')
		let year = parseInt(date.substr(0,first));
		let month = parseInt(date.substr(first+1,second))-1;
		let day = parseInt(date.substr(second+1,date.length));

		d.setFullYear(year);
		d.setMonth(month);
		d.setDate(day);
		return d;

	}




	//para graficos de demora de medicos

	public nameOfTheDoctors:string[] = [];
	private nameOfTheDoctorsTurns:string[] = [];
	public datasOfTheDoctors:any[] = [];


	clearCharts() {
		while (this.nameOfTheDoctors.length > 0)
			this.nameOfTheDoctors.pop();
		while (this.nameOfTheDoctorsTurns.length > 0)
			this.nameOfTheDoctorsTurns.pop();

	    this.datasOfTheDoctors= [
	      {data: [], label: 'label1'},
	      {data: [], label: 'label2'}
	    	];
	    this.dataTurns= [
	      {data: [], label: 'label1'},
	      {data: [], label: 'label2'}
	    	];
 	}


	prepareGraphicDelay(array: nameAVG[]){
		this.clearCharts();
		// console.log(this.nameOfTheDoctors);
		let auxAVGDoctors = [];
		let auxAVGPatients = [];

		for (var i = 0; i < array.length; i++) {
			if (array[i].avgDoctor != 0 || array[i].avgPatient != 0){
				this.nameOfTheDoctors.push(array[i].name);
				auxAVGDoctors.push(array[i].avgDoctor);
				auxAVGPatients.push(array[i].avgPatient);
				
			}
			
		}
		
		this.datasOfTheDoctors = [
						{data: auxAVGDoctors , label: 'Demora de doctores (en minutos)'},
						{data: auxAVGPatients , label: 'Demora de pacientes (en minutos)'}
						];

		// console.log(this.datasOfTheDoctors);
		

		
						
						

	}
	
	private auxCountWeb = [];
	private auxCountDesktop = [];
	private minMax = [];
	private avgs = [];
	prepareGraphicTurns(delay: nameAVG[]){


		this.auxCountDesktop = [];
		this.auxCountWeb = [];
		this.pieChartData = [];
		
		for (var i = 0; i < delay.length; i++) {
			this.nameOfTheDoctorsTurns.push(delay[i].name);
		}

		// console.log(this.nameOfTheDoctorsTurns);

		for (var k = 0; k < this.nameOfTheDoctorsTurns.length; k++) {
				this.auxCountDesktop.push(this.webVSdesktopArr[k].desktop);
				this.auxCountWeb.push(this.webVSdesktopArr[k].web);	
		}			

		this.dataTurns = [
							{data: this.auxCountWeb , label: 'Cantidad de turnos por web'},
							{data: this.auxCountDesktop , label: 'Cantidad de turnos por escritorio'}
						];



		let a = 0;

		for (var i = 0; i < this.auxCountDesktop.length; i++) {
			a = a + parseInt(this.auxCountDesktop[i]);
		}


		let b = 0;
		for (var k = 0; k < this.auxCountWeb.length; k++) {
			b = b + parseInt(this.auxCountWeb[k]);
		}
		
		this.pieChartData = [b,a];
		this.minMax = this.getMinAndMax();
		this.avgs = this.getAVGs();
	}
	
	getMinAndMax():number[]{
		let minWeb = this.auxCountWeb[0];
		let minDesktop = this.auxCountDesktop[0];

		let maxWeb = this.auxCountWeb[0];
		let maxDesktop = this.auxCountDesktop[0];

		for (var i = 1; i < this.auxCountWeb.length; i++) {
			if (this.auxCountWeb[i]>maxWeb)
				maxWeb = this.auxCountWeb[i]
			if (this.auxCountWeb[i]<minWeb)
				minWeb = this.auxCountWeb[i]

			if (this.auxCountDesktop[i]>maxDesktop)
				maxDesktop = this.auxCountDesktop[i]
			if (this.auxCountDesktop[i]<minDesktop)
				minDesktop = this.auxCountDesktop[i]
		}


		return [minWeb,minDesktop,maxWeb,maxDesktop];
	}

	getAVGs():any[]{
		let avgWeb = 0;
		let avgDesktop = 0;
		for (var i = 0; i < this.auxCountWeb.length; i++) {
			avgWeb = avgWeb + parseInt(this.auxCountWeb[i]);
			avgDesktop = avgDesktop + parseInt(this.auxCountDesktop[i]);
		}
		avgWeb = parseInt((avgWeb/this.auxCountWeb.length).toFixed(2));
		avgDesktop = parseInt((avgDesktop/this.auxCountDesktop.length).toFixed(2));
		return [avgWeb,avgDesktop];
	}



	public optionsDelays:any = {
	    scaleShowVerticalLines: false,
	    responsive: true,
	    scales: {
	    			yAxes: [{
                		ticks: {
                    		beginAtZero: true,
                    		maxTicksLimit: 5,
                    		// Create scientific notation labels
                    		callback: function(value, index, values) {
                        		return value + ' minutos';
                    		}
                }
            }],
		        	xAxes: [{
		            ticks: {
		                display: true,
		                // beginAtZero: true,
		                autoSkip: false,
                		// stepSize: 1,
                		// min: 0,
                		
                		maxRotation: 90,
                		minRotation: 90,
		                callback: function(value, index, values){
		                	return value.split(" ").join("\n");
		                }
		            	},
		            	stacked: this.stack

		        	}]
		    	}

	};

	//para grafico de turnos medico a medico
	private dataTurns:any[] = [];
	public optionsTurns:any = {
	    scaleShowVerticalLines: false,
	    responsive: true,
	    scales: {
	    			yAxes: [{
                		ticks: {
                    		beginAtZero: true,
                    		maxTicksLimit: 5,
                    		// Create scientific notation labels
                    		callback: function(value, index, values) {
                        		return value + ' turnos';
                    		}
                }
            }],
		        	xAxes: [{
		            ticks: {
		                display: true,
		                // beginAtZero: true,
		                autoSkip: false,
                		// stepSize: 1,
                		// min: 0,
                		
                		maxRotation: 90,
                		minRotation: 90,
		                callback: function(value, index, values){
		                	return value.split(" ").join("\n");
		                }
		            	},
		            	stacked: this.stack

		        	}]
		    	}

	};

	
	//para grafico de turnos global

	public pieChartLabels:string[] = ['Turnos Web', 'Turnos Escritorio'];
  	public pieChartData:number[] = [];
  	public pieChartType:string = 'pie';



	//configuraciones generales para cualquier grafico
	public barChartType:string = 'bar';
	public barChartLegend:boolean = true;

	
	
	stackBars(){
		this.stack = !this.stack;
		
		this.optionsDelays = {
		    scaleShowVerticalLines: false,
		    responsive: true,
		    scales: {
		    			yAxes: [{
	                		ticks: {
	                    		beginAtZero: true,
	                    		maxTicksLimit: 5,
	                    		// Create scientific notation labels
	                    		callback: function(value, index, values) {
	                        		return value + ' minutos';
	                    		}
	                }
	            }],
			        	xAxes: [{
			            ticks: {
			                display: true,
			                // beginAtZero: true,
			                autoSkip: false,
	                		// stepSize: 1,
	                		// min: 0,
	                		
	                		maxRotation: 90,
	                		minRotation: 90,
			                callback: function(value, index, values){
			                	return value.split(" ").join("\n");
			                }
			            	},
			            	stacked: this.stack

			        	}]
			    	}
			};	

		this.optionsTurns = {
		    scaleShowVerticalLines: false,
		    responsive: true,
		    scales: {
		    			yAxes: [{
	                		ticks: {
	                    		beginAtZero: true,
	                    		maxTicksLimit: 5,
	                    		// Create scientific notation labels
	                    		callback: function(value, index, values) {
	                        		return value + ' turnos';
	                    		}
	                }
	            }],
			        	xAxes: [{
			            ticks: {
			                display: true,
			                // beginAtZero: true,
			                autoSkip: false,
	                		// stepSize: 1,
	                		// min: 0,
	                		
	                		maxRotation: 90,
	                		minRotation: 90,
			                callback: function(value, index, values){
			                	return value.split(" ").join("\n");
			                }
			            	},
			            	stacked: this.stack

			        	}]
			    	}
			};

	}

	public chartClickedCombined(e:any,wORd:any){
		this.arrayPatients = []
		if (e.active != {} && e.active.length > 0){
			this.nameButton=e.active[0]._model.label;
			this.nameButton=(e.active[0]._index == 0?"Atendidos":"No atendidos");
			if(e.active[0]._index == 0) //atendidos
				for (var i = 0; i < this.newTurnsFilter.length; ++i) {
					if (this.newTurnsFilter[i].campo5.trim().toUpperCase() == STATE_TURN.ATTENDED.trim().toUpperCase()
						&& this.newTurnsFilter[i].subTema.trim() == wORd.trim())
						this.arrayPatients.push(this.newTurnsFilter[i]);
				}
			else
				for (var i = 0; i < this.newTurnsFilter.length; ++i) {
					if (this.newTurnsFilter[i].campo5.trim().toUpperCase() != STATE_TURN.ATTENDED.trim().toUpperCase()
						&& this.newTurnsFilter[i].subTema.trim() == wORd.trim())
						this.arrayPatients.push(this.newTurnsFilter[i]);
				}
			document.getElementById("btnInfo").click();
		}
		else
			this.nameButton = ANYBODY;
		console.log(e);
	}

	// events
	public chartClicked(e:any):void {
		this.arrayPatients = []
		if (e.active != {} && e.active.length > 0){
			this.nameButton=e.active[0]._model.label;
			
			if (this.isDelay())
				for (var i = 0; i < this.arraySol.length; ++i) {
					if (this.arraySol[i].campo1.trim().toUpperCase() == this.nameButton.trim().toUpperCase())
						this.arrayPatients.push(this.arraySol[i]);
				}
			else if (this.isWebVsDesktop()){
				for (var i = 0; i < this.turnsCompleteds.length; ++i) {
					if (this.turnsCompleteds[i].campo1.trim().toUpperCase() == this.nameButton.trim().toUpperCase())
						this.arrayPatients.push(this.turnsCompleteds[i]);
				}
			}
			// else if(this.isStateCombinedWithWebVsDesktop()){
				// this.nameButton=(e.active[0]._index == 0?"Atendidos":"No atendidos");
				// if(e.active[0]._index == 0) //atendidos
				// 	for (var i = 0; i < this.turnsCompleteds.length; ++i) {
				// 		if (this.turnsCompleteds[i].campo5.trim().toUpperCase() == STATE_TURN.ATTENDED.trim().toUpperCase())
				// 			this.arrayPatients.push(this.turnsCompleteds[i]);
				// 	}
				// else
				// 	for (var i = 0; i < this.turnsCompleteds.length; ++i) {
				// 		if (this.turnsCompleteds[i].campo5.trim().toUpperCase() != STATE_TURN.ATTENDED.trim().toUpperCase())
				// 			this.arrayPatients.push(this.turnsCompleteds[i]);
				// 	}
			// }
			else
				{	
					if(e.active[0]._index == 0){
						this.nameButton = "Aun no se presentan";
						for (var i = 0; i < this.newTurnsFilter.length; ++i) {
							if (this.newTurnsFilter[i].campo5.trim().toUpperCase() == STATE_TURN.MISSING.trim().toUpperCase())
								this.arrayPatients.push(this.newTurnsFilter[i]);
						}
					}
					else if(e.active[0]._index == 1){
						this.nameButton = "Atendidos";
						for (var i = 0; i < this.newTurnsFilter.length; ++i) {
							if (this.newTurnsFilter[i].campo5.trim().toUpperCase() == STATE_TURN.ATTENDED.trim().toUpperCase())
								this.arrayPatients.push(this.newTurnsFilter[i]);
						}
					}
					else if(e.active[0]._index == 2){
						this.nameButton = "En sala de espera";
						for (var i = 0; i < this.newTurnsFilter.length; ++i) {
							if (this.newTurnsFilter[i].campo5.trim().toUpperCase() == STATE_TURN.WAITING.trim().toUpperCase())
								this.arrayPatients.push(this.newTurnsFilter[i]);
						}
					}
					else if(e.active[0]._index == 3){
						this.nameButton = "Falto";
						for (var i = 0; i < this.newTurnsFilter.length; ++i) {
							if (this.newTurnsFilter[i].campo5.trim().toUpperCase() == STATE_TURN.F.trim().toUpperCase())
								this.arrayPatients.push(this.newTurnsFilter[i]);
						}
					}
					else if(e.active[0]._index == 4)	{
						this.nameButton = "Falto con aviso";
						for (var i = 0; i < this.newTurnsFilter.length; ++i) {
							if (this.newTurnsFilter[i].campo5.trim().toUpperCase() == STATE_TURN.FCA.trim().toUpperCase())
								this.arrayPatients.push(this.newTurnsFilter[i]);
						}
					}
				}
				
				document.getElementById("btnInfo").click();
		}
		else
			this.nameButton = ANYBODY;
		console.log(e);
	}

	/*public chartHovered(e:any):void {
		console.log(e);
	}*/

	nothing(){
		console.log("nothing");
	}
 

	public pieChartOptions: any = {
        	
        	tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                	return data.labels[tooltipItem.index] + data.datasets[0].data[tooltipItem.index]  + '%';
                    

                }
            }
        }
    };

    


	//grafico de torta estado de turnos
	public stateLabels:string[] = ['Aun no se presentan', 'Atendidos', 'En sala de espera', 'Falto', 'Falto con aviso', 'En el consultorio'];
  	public stateData:number[] = [];
  	public attendedLabels: string[] = ['Atendidos: ', 'No atendidos: '];


  	countInfo(	arraySubTema: string, 
  				indexAttended: number,
  				indexCombinedData: number
  			){

  		if (arraySubTema.toUpperCase() == SUBTOPIC.WEB.toUpperCase()){
			this.attendedWeb[indexAttended] = this.attendedWeb[indexAttended] + 1;
			this.combinedDataWeb[indexCombinedData] = this.combinedDataWeb[indexCombinedData] + 1;
		}
		else{
			this.attendedDesktop[indexAttended] = this.attendedDesktop[indexAttended] + 1;
			this.combinedDataDesktop[indexCombinedData] = this.combinedDataDesktop[indexCombinedData] + 1;
		}
  	}


  	getStatesOfTurns(array: turnosV0[]){
  		this.stateData = [];
  		//0: para  atendidos 1: para no atendidos
  		this.attendedDesktop = [0,0];
  		this.attendedWeb = [0,0];
  		this.combinedDataDesktop = [0,0,0,0,0,0];
		this.combinedDataWeb = [0,0,0,0,0,0];

  		let aux: number[] = [0,0,0,0,0,0];
  		for (var i = 0; i < array.length; i++) {
  			if (array[i].campo5.trim() == STATE_TURN.MISSING){
  				this.countInfo(array[i].subTema,1,0);
  				aux[0] = aux[0] + 1;
  			}
  			else if (array[i].campo5.trim() == STATE_TURN.ATTENDED) {
  				this.countInfo(array[i].subTema,0,1);
  				aux[1] = aux[1] + 1;
  			}
  			else if (array[i].campo5.trim() == STATE_TURN.WAITING){
  				this.countInfo(array[i].subTema,1,2);
  				aux[2] = aux[2] + 1;
  			}
  			else  if(array[i].campo5.trim() == STATE_TURN.F){
  				this.countInfo(array[i].subTema,1,3);
  				aux[3] = aux[3] + 1;
  			}
  			else if(array[i].campo5.trim() == STATE_TURN.FCA){
  				this.countInfo(array[i].subTema,1,4);
  				aux[4] = aux[4] + 1;
  			}
  			else if (array[i].campo5.trim() == STATE_TURN.C){
  				this.countInfo(array[i].subTema,1,5);
  				aux[5] = aux[5] + 1;
  			}
  			else 
  				console.log(array[i]);
  		}

  		let totalAttDes = this.attendedDesktop[0] + this.attendedDesktop[1];
  		let totalAttWeb = this.attendedWeb[0] + this.attendedWeb[1];
  		this.attendedDesktop[0] = ( this.attendedDesktop[0] * 100 / totalAttDes ).toFixed(2);
  		this.attendedDesktop[1] = ( this.attendedDesktop[1] * 100 / totalAttDes ).toFixed(2);
  		this.attendedWeb[0] = ( this.attendedWeb[0] * 100 / totalAttWeb ).toFixed(2);
  		this.attendedWeb[1] = ( this.attendedWeb[1] * 100 / totalAttWeb ).toFixed(2);
  		this.stateData = aux;
  	}


	getTotalTurns(){
		if (this.isDelay())
			return this.totalDelays;
		else 
			return this.totalOthers; 
	}





	onChangeType(){
		this.nameButton = ANYBODY;
		if (this.isDelay())
			this.appComponent.stateFilter = false;
		else 
			this.appComponent.stateFilter = true;
	}


	//funcion y variable para el cambio de tamaño en Estadisticas de estado de turnos (Web vs Escritorio)
	private sizeBoolean:boolean = true;
	changeSizeBoolean(){
		this.nameButton = ANYBODY;
		this.sizeBoolean = !this.sizeBoolean;
	}


	//funciones booleanas para comparar que tipo de grafico voy a tener que mostrar

	

	isDelay():boolean{
		return this.graphtype == '1';
	}

	isWebVsDesktop():boolean{
		return this.graphtype == '2';
	}

	isState(): boolean{
		return this.graphtype == '3';
	}

	isStateCombinedWithWebVsDesktop():boolean{
		return this.graphtype == '4';
	}

	isDisableNameButton():boolean{
		return this.nameButton == ANYBODY;
	}

	istrue(){
		return true;
	}
}

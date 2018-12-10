import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { DbPetitionsComponent } from '../../providers/dbPetitions';
import { Router } from '@angular/router';
import { PAGES } from '../../constants';
import { Filter } from '../../models/filter'

@Component({
  selector: 'navBar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers: [ DbPetitionsComponent ]
})
export class NavBarComponent implements OnInit {

  user = null;
  private clients: any[] = null;

  constructor(
              private _appComponent: AppComponent,
              private _dbPetitions: DbPetitionsComponent,
              private _router: Router
              ){ 

          // console.log(this._appComponent.getClients());
    if (this.clientsExists()){
      this.user = this._appComponent.getCurrentClient().nombreFuente;
      this.clients = this._appComponent.getClients(); 
    }

    
  }

  ngOnInit() {
  }

  logout(){
    this._appComponent.filter.excludeSurname = '';
    this._appComponent.filter.foundSurname = '';
  	localStorage.clear();
    localStorage.setItem('logged', 'false');
    localStorage.setItem('loading','false');
    localStorage.setItem('relog','false');
  }

  changeClient(value){
      let c: string = value;
      let r;
      this._dbPetitions.connectToClient(c).subscribe(
        (dbpet)=>{
          r = dbpet;
          localStorage.setItem('loading','true');
          if (r){
            if (r.error){
              if (r.error.message.includes('debe logearse')){
                alert('Debe relogearse');
                localStorage.clear();
                localStorage.setItem('logged', 'false');
                this._router.navigate([PAGES.LOGIN]);
              }
              else alert(r.error.message);
            }
            else {
              alert ('cambiado con exito a: ' + value);
              // this.user = this._appComponent.getCurrentClient().nombreFuente;
              console.log(r);
              this.user = c;
              //NUEVO
              let doctors: any[];
              let services: any[];
              let coverages: any[];
              doctors = dbpet.data.medicos;
              services = dbpet.data.servicios;
              coverages = dbpet.data.coberturas;
              this._appComponent.setDoctors(doctors);
              this._appComponent.setServices(services);
              this._appComponent.setCoverages(coverages);
              let client: any[];
              client = dbpet.otracosa.fuenteDatos;
              this._appComponent.setClients(client);
              //FIN DE LO NUEVO

              //location.reload();//recarga la pagina
              // let url = this._router.url.substr(1,this._router.url.length);
              // this._appComponent.filter = new Filter('','','','','','Todos','','');
              this._router.navigate([PAGES.HOME]);
              document.getElementById('usr').innerHTML = '<strong>Conectado a </strong>' + this.user;
              // localStorage.setItem('reload','true');
            }
            localStorage.setItem('loading','false');

          }},
        (err)=>{
                alert('El cliente no existe')
                localStorage.clear();
                localStorage.setItem('logged', 'false');
                this._router.navigate([PAGES.LOGIN]);
        });
  }
 
  clientsExists(){
    
    if (this._appComponent.getClients()){
      this.user = this._appComponent.getCurrentClient().nombreFuente;
      this.clients = this._appComponent.getClients(); 
    }
    return (this.clients != null);
  }

  

  isLogged(){
    return localStorage.getItem('logged') != null && localStorage.getItem('logged') == 'true';
  }

}

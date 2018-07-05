import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { DbPetitionsComponent } from '../../providers/dbPetitions'
import { Router } from '@angular/router';

@Component({
  selector: 'navBar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers: [ DbPetitionsComponent ]
})
export class NavBarComponent implements OnInit {

  user;
  private clients: any;

  constructor(
              private _appComponent: AppComponent,
              private _dbPetitions: DbPetitionsComponent,
              private _router: Router
              ){ 
    this.user = this._appComponent.getCurrentClient().nombreFuente;
    this.clients = this._appComponent.getClients();
  }

  ngOnInit() {
  }

  logout(){
    this._appComponent.filter.excludeSurname = '';
    this._appComponent.filter.foundSurname = '';
  	localStorage.clear();
    localStorage.setItem('logged', 'false');
    localStorage.setItem('loading','false');
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
                this._router.navigate(['']);
              }
              else alert(r.error.message);
            }
            else alert ('cambiado con exito a: ' + value);
            localStorage.setItem('loading','false');

          }
        });
  }

}

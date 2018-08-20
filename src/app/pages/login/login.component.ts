import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppComponent } from '../../app.component';
import { STORAGE, back } from '../../constants';
import { User } from './user';
import { DbPetitionsComponent } from '../../providers/dbPetitions';
import { UserCredentials, DoctorQuery } from '../../interfaces';
import { ERR_UPS } from '../../constants';

import { turnosV0 } from '../../interfaces';
import { Observable } from 'rxjs';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  acc: User;
  

  constructor(
		private _route: ActivatedRoute,
		private _router: Router,
    private _appComponent: AppComponent,
    private _DbPetitionsComponent: DbPetitionsComponent
	){
    this.acc = new User("","",false);
  }

  ngOnInit() {

    if (localStorage.getItem('checked') != null)
      back.chk = localStorage.getItem('checked');
    if (localStorage.getItem('user') != null)
      back.usr = localStorage.getItem('user');
    if (localStorage.getItem('password') != null)
      back.psw = localStorage.getItem('password');
    if (localStorage.getItem('loading') != null)
      back.loading = localStorage.getItem('loading');
    if (localStorage.getItem('logged') != null)
      back.logged = localStorage.getItem('logged');
    if (localStorage.getItem('relog') != null)
      back.relog = localStorage.getItem('relog');
    if (localStorage.getItem('url') != null)
      back.url = localStorage.getItem('url');
    


    if (back.relog == 'true'){
      this.acc.checked = back.chk;
      this.acc.password = back.psw;
      this.acc.user = back.usr;
      this.login();  
    }

    this._appComponent.setNotFilter(false);
    this._appComponent.stateFilter = false;
    localStorage.setItem('logged','false'); 
    // localStorage.setItem('loading','false');
    clearInterval(this._appComponent.interval);
  }

  account: UserCredentials = {
    enrollmentId: '',
    password: ''
  };



  login(){ 
    
    localStorage.setItem('loading','true');
    this.account.enrollmentId = this.acc.user;
    this.account.password = this.acc.password;
    var resp;
    
    console.log('logging..');
    this._DbPetitionsComponent.login(this.account).subscribe(
      (loginresp) =>{
        resp = loginresp;

        if (resp){
          // console.log(resp);
          let doctors: any[];
          let services: any[];
          let coverages: any[];
          doctors = resp.conexion.data.medicos;
          services = resp.conexion.data.servicios;
          coverages = resp.conexion.data.coberturas;
          this._appComponent.setDoctors(doctors);
          this._appComponent.setServices(services);
          this._appComponent.setCoverages(coverages);
          let client: any[];
          client = resp.usuario.fuenteDatos;
          this._appComponent.setClients(client);
          localStorage.clear();
    			localStorage.setItem('checked',this.acc.checked);
    			localStorage.setItem('user',this.acc.user);
    			localStorage.setItem('password',this.acc.password);
          localStorage.setItem('logged', 'true');
          localStorage.setItem('relog',back.relog);
          localStorage.setItem('loading','false');
          localStorage.setItem('url',back.url);
          if (localStorage.getItem('url') != null)  
            this._router.navigate([localStorage.getItem('url')]);
    			else 
            this._router.navigate(['home']);
			
        }
        else{
          localStorage.setItem('loading','false');
          alert(ERR_UPS);
        }
      },
      (err) => {
          localStorage.setItem('loading','false');
          localStorage.setItem('logged','false');
          let msg = ERR_UPS;
          if (err.message.includes('incorrecto'))
            msg = 'Matrícula o contraseña incorrecta';

          alert(msg);
        // console.log(msg);

      });    
  }


  

}

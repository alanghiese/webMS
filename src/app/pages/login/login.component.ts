import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppComponent } from '../../app.component';
import { STORAGE } from '../../constants';
import { User } from './user';
import { DbPetitionsComponent } from '../../providers/dbPetitions';
import { UserCredentials, DoctorQuery } from '../../interfaces';

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

  back = {
    chk: '',
    usr: '',
    psw: '',
    logged: '',
    loading: '',
    relog: ''
    };

  ngOnInit() {
    // console.log('entre al login')

    if (localStorage.getItem('checked') != null)
      this.back.chk = localStorage.getItem('checked');
    if (localStorage.getItem('user') != null)
      this.back.usr = localStorage.getItem('user');
    if (localStorage.getItem('password') != null)
      this.back.psw = localStorage.getItem('password');
    if (localStorage.getItem('loading') != null)
      this.back.loading = localStorage.getItem('loading');
    if (localStorage.getItem('logged') != null)
      this.back.logged = localStorage.getItem('logged');
    if (localStorage.getItem('relog') != null)
      this.back.relog = localStorage.getItem('relog');
    
    // console.log(this.back.logged);
    // console.log(this.back.chk);

    if (this.back.relog == 'true'){
      this.acc.checked = this.back.chk;
      this.acc.password = this.back.psw;
      this.acc.user = this.back.usr;
      this.login();
    }
    
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
          
         // this._appComponent.doctors =
         //  this._DbPetitionsComponent.getDoctors('')
         //  .subscribe(
         //    (dResp) => {
         //      let docs;
         //      docs = dResp;
         //      console.log(dResp);
         //      if (dResp)
         //        console.log(dResp);
         //      else
         //        console.log('no muestro dResp');
         //    },
         //    (err)=>{
         //      let msg = 'Ups! Algo salió mal, intente de nuevo';
         //      alert(msg);
         //    }
         //    );
          // this._DbPetitionsComponent.getDoctors('').subscribe();


          let client: any[];
          client = resp.usuario.fuenteDatos;
          this._appComponent.setClients(client);
          localStorage.clear();
    			localStorage.setItem('checked',this.acc.checked);
    			localStorage.setItem('user',this.acc.user);
    			localStorage.setItem('password',this.acc.password);
          localStorage.setItem('logged', 'true');
          localStorage.setItem('relog',this.back.relog);
          localStorage.setItem('loading','false');
    			this._router.navigate(['home']);
			
        }
        else{
          localStorage.setItem('loading','false');
          alert('Datos incorrectos');
        }
      },
      (err) => {
          localStorage.setItem('loading','false');
          localStorage.setItem('logged','false');
          let msg = 'Ups! Algo salió mal, intente de nuevo';
          if (err.message.includes('incorrecto'))
            msg = 'Matrícula o contraseña incorrecta';

          alert(msg);
        // console.log(msg);

      });    
  }

}

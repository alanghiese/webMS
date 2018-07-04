import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppComponent } from '../../app.component';
import { STORAGE } from '../../constants';
import { User } from './user';
import { DbPetitionsComponent } from '../../providers/dbPetitions';
import { UserCredentials } from '../../interfaces';

import { turnosV0 } from '../../interfaces';
import { Observable } from 'rxjs';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  acc: User;
  private loading: boolean = false;
  

  constructor(
		private _route: ActivatedRoute,
		private _router: Router,
    private _appComponent: AppComponent,
    private _DbPetitionsComponent: DbPetitionsComponent
	){
    this.acc = new User("","",false);
  }

  ngOnInit() {
      if (localStorage.getItem('checked') == null){
        localStorage.setItem('checked','false');
        localStorage.setItem('user','');
        localStorage.setItem('password',''); 
        this._appComponent.logged = false;
      }
      else if (localStorage.getItem('checked') != null && localStorage.getItem('checked') == 'true'){
        this.acc.checked = localStorage.getItem('checked');
        this.acc.user = localStorage.getItem('user');
        this.acc.password = localStorage.getItem('password');
        if (localStorage.getItem('user') != null && localStorage.getItem('password') != null)
          this._appComponent.logged = true;
        
        if (this._appComponent.logged)
          this.login();
        
        
      }



  }

  account: UserCredentials = {
    enrollmentId: '',
    password: ''
  };


  login(){ //formLogin: NgForm

    this.account.enrollmentId = this.acc.user;
    this.account.password = this.acc.password;
    var resp;
    
    this.loading = true;
    this._DbPetitionsComponent.login(this.account).subscribe(
      (loginresp) =>{
        resp = loginresp;
        // console.log(resp);

        //this._DbPetitionsComponent.connectToClient('delCerro').subscribe();
        this._DbPetitionsComponent.getAppointments(new Date(),new Date()).subscribe();
     
        if (resp){

    			localStorage.setItem('checked',this.acc.checked);
    			localStorage.setItem('user',this.acc.user);
    			localStorage.setItem('password',this.acc.password);
          this._appComponent.logged = true;
    			this.loading = false;
    			this._router.navigate(['home']);
			
        }
        else{
          this.loading = false;
          alert('Datos incorrectos');
        }
      },
      (err) => {
        this.loading = false;
        let msg = 'Ups! Algo salió mal, intente de nuevo';
        if (err.message.includes('incorrecto'))
          msg = 'Matrícula o contraseña incorrecta';

        alert(msg);
        // console.log(msg);

      });    
  }

}

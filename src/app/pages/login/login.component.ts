import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppComponent } from '../../app.component';
import { STORAGE } from '../../constants';
import { User } from './user';
import { DbPetitionsComponent } from '../../providers/dbPetitions';
import { UserCredentials } from '../../interfaces';


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
    if (localStorage.getItem('checked') == null){
      localStorage.setItem('checked','false');
      localStorage.setItem('user','');
      localStorage.setItem('password',''); 
      this._appComponent.logged = false;
    }

    
    
  }

  account: UserCredentials = {
    enrollmentId: '',
    password: ''
  };

  login(){
    // console.log(this.acc);
    localStorage.setItem('checked',this.acc.checked);
    localStorage.setItem('user',this.acc.user);
    localStorage.setItem('password',this.acc.password);
    this.account.enrollmentId = this.acc.user;
    this.account.password = this.acc.password;
    var resp;
    this._DbPetitionsComponent.login(this.account).subscribe(
      (loginresp) =>{
        resp = loginresp;
        console.log(resp);
        if (resp){
          this._appComponent.logged = true; 
          this._router.navigate(['home']);
        }
        else
          alert('Datos incorrectos');
      },
      (err) => console.log('ERROR'));


    //esta llendo al home antes de terminar el login
    
    
  }
}

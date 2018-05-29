//modulos de angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http'
import { routing, appRoutingProviders } from './app.routing'

//components and pages
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { GraphsComponent } from './pages/graphs/graphs.component';
import { TurnsComponent } from './pages/turns/turns.component';
import { EmptyComponent } from './pages/empty/empty.component';
import { Error404Component } from './pages/error404/error404.component';
import { UparrowComponent } from './components/uparrow/uparrow.component';
import { CloseButtonComponent } from './components/close-button/close-button.component';
import { LoginComponent } from './pages/login/login.component';
import { TurnsfiltersComponent } from './components/turnsfilters/turnsfilters.component';
import { SessionProvider } from './providers/session';
import { DbPetitionsComponent } from './providers/dbPetitions';
import { LoadingIMGComponent } from './components/loading-img/loading-img.component';



@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterComponent,
    ButtonsComponent,
    GraphsComponent,
    TurnsComponent,
    EmptyComponent,
    Error404Component,
    UparrowComponent,
    CloseButtonComponent,
    LoginComponent,
    TurnsfiltersComponent,
    LoadingIMGComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    ChartsModule,
    HttpClientModule,
    routing
  ],
  providers: [
      appRoutingProviders,
      SessionProvider,
      DbPetitionsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

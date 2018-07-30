import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//importar componentes a utilizar en el router
import { GraphsComponent } from './pages/graphs/graphs.component';
import { TurnsComponent } from './pages/turns/turns.component';
import { EmptyComponent } from './pages/empty/empty.component';
import { Error404Component } from './pages/error404/error404.component';
import { LoginComponent } from './pages/login/login.component';
import { RealTimeComponent } from './pages/real-time/real-time.component'
import { ContactComponent } from './pages/contact/contact.component'




 

const appRoutes: Routes = [
	{path: '', component: EmptyComponent},
	{path: 'home', component: EmptyComponent},
	{path: 'turns', component: TurnsComponent},
	{path: 'graphs', component: GraphsComponent},
	{path: 'now', component: RealTimeComponent},
	{path: 'login', component: LoginComponent},
	{path: 'contact', component: ContactComponent},
	{path: '**', component: Error404Component}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
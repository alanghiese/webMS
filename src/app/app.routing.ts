import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//importar componentes a utilizar en el router
import { GraphsComponent } from './pages/graphs/graphs.component';
import { TurnsComponent } from './pages/turns/turns.component';
import { EmptyComponent } from './pages/empty/empty.component';
import { Error404Component } from './pages/error404/error404.component';



 

const appRoutes: Routes = [
	{path: '', component: EmptyComponent},
	{path: 'home', component: EmptyComponent},
	{path: 'turns', component: TurnsComponent},
	{path: 'graphs', component: GraphsComponent},
	{path: 'graphs/:param', component: GraphsComponent},
	{path: '**', component: Error404Component}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
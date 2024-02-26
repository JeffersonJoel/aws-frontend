import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { HomeComponent } from './components/home/home.component';
import { PruebaComponent } from './components/prueba/prueba.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { PagoComponent } from './components/pago/pago.component';
import { ReservasComponent } from './components/reservas/reservas.component';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  {path:'inicio',component:HomeComponent},
  {path:'habitaciones',component:HabitacionesComponent},
  {path:'prueba',component:PruebaComponent},
  {path:'formulario', component:FormularioComponent},
  {path:'pago', component:PagoComponent},
  {path:'buscar',component:ReservasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

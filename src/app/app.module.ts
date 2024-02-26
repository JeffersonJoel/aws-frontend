import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { PruebaComponent } from './components/prueba/prueba.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FormularioComponent } from './components/formulario/formulario.component';
import { PagoComponent } from './components/pago/pago.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { DatosService } from 'src/app/services/datos';
import { ReservasComponent } from './components/reservas/reservas.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HabitacionesComponent,
    PruebaComponent,
    FormularioComponent,
    PagoComponent,
    ReservasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPayPalModule 
  ],
  providers: [
    DatosService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

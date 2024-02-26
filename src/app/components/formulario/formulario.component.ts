import { Component, OnInit} from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { Global } from 'src/app/services/global';
import { HotelService } from 'src/app/services/hotel.service';
import { DatosService } from 'src/app/services/datos';
import { Router } from '@angular/router'; // Importa el servicio Router
import { Reservacion } from 'src/app/models/reservacion';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css','./formulario.responsive.css'],
  providers: [HotelService]
})

export class FormularioComponent implements OnInit{
  public url: string;
  public carrito: any[] = [];
  public nuevaReservacion: Reservacion[] = [];
  public nuevoCliente: Cliente;



    constructor(private _hotelService: HotelService,private datosService: DatosService,private router: Router) {
      this.url = Global.url;
      this.nuevoCliente=new Cliente('','','','','','','');
    }

    ngOnInit(): void {
      this.datosService.carrito$.subscribe(carrito => this.carrito = carrito);
      this.datosService.nuevaReservacion$.subscribe(reservacion => this.nuevaReservacion = reservacion);
    }
    enviarformulario() {
      console.log('enviarformulario');

      this._hotelService.saveCliente(this.nuevoCliente).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);
          console.log("antes de enviar",this.nuevoCliente);
          this.nuevoCliente=response.cliente;
          this.datosService.actualizarNuevoCliente(this.nuevoCliente);
          this.router.navigate(['/pago']);


        },
        error => {
            console.error(error);
        }
    );
  }
  calcularSubtotal(): number {
    let subtotal = 0;
    for (const reserva of this.carrito) {
      subtotal += reserva.precioTotal;
    }
    return subtotal;
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from "src/app/models/cliente";
import { Habitacion } from 'src/app/models/habitacion';
import { Reservacion } from "src/app/models/reservacion";
import { Global } from 'src/app/services/global';
import { HotelService } from 'src/app/services/hotel.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css','./reservas.responsive.css'],
  providers: [HotelService]
})
export class ReservasComponent implements OnInit {
  cedula: string = '';
  idReserva: string = '';
  public Reservaciones: Reservacion[];
  public Habitaciones: Habitacion[];
  public Cliente: Cliente;
  public reservainfo: any[] = [];
  public url:string;
  public subtotal:number;
  public precio ;
  public iva:number;
  constructor(private _hotelService: HotelService) {
    this.Reservaciones = [];
    this.Habitaciones = [];
    this.Cliente=new Cliente('','','','','','','');
    this.url = Global.url;
    this.iva=0;
    this.subtotal=0;
    this.precio=0;

   }

  ngOnInit(): void {
    this.obtenerReservaciones();
    this.obtenerHabitaciones();
  }
  obtenerReservaciones() {
    this._hotelService.getReservaciones().subscribe(
      response => {
        this.Reservaciones = response.reservaciones;
      },
      error => {
        console.error(error);
      }
    );
    
  }
  obtenerCliente(idcliente: string): Observable<any> {
    console.log(idcliente);
    return this._hotelService.getCliente(idcliente);
  }


  buscarReservas() {
    
    
    // Llama al servicio para buscar las reservas según los criterios
    const reservasEncontradas = this.Reservaciones.filter(reserva => reserva.IdReservacion === this.idReserva);
    
    // Verificar si se encontraron reservas
    if (reservasEncontradas.length > 0) {

      this.obtenerCliente(reservasEncontradas[0].IDCliente).subscribe(
        response => {
          // Ahora puedes realizar acciones que dependan de this.Cliente
          this.Cliente = response.cliente;
          console.log("dentro de la función cliente:", this.Cliente);
          
          // Resto del código...

          for (const reservaEncontrada of reservasEncontradas) {
            const habitacion = this.Habitaciones.find(hab => hab._id === reservaEncontrada.IDHabitacion);
            const fechaCheckIn = reservaEncontrada.FechaCheckIn;
            const fechaCheckOut = reservaEncontrada.FechaCheckOut;
            const diffTime = Math.abs(new Date(fechaCheckOut).getTime() - new Date(fechaCheckIn).getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (habitacion) {
              const reservaCarrito = {
                  numAdultos: reservaEncontrada.NumAdultos,
                  numNinos: reservaEncontrada.NumNinos, 
                  fechaCheckIn: fechaCheckIn,
                  fechaCheckOut: fechaCheckOut,
                  desayuno: reservaEncontrada.Desayuno,
                  estadoReservacion: reservaEncontrada.EstadoReservacion,
                  fechaReservacion: reservaEncontrada.FechaReservacion,
                  preciopornoche: habitacion.Precio,
                  n_noches:diffDays,
                  precioTotal: reservaEncontrada.PrecioTotal,
                  imagen: habitacion.Imagen,
                  tipoHabitacion: habitacion.TipoHabitacion,
                  tipoAlojamiento: habitacion.TipoAlojamiento
              };
              
              // Agregar reservaCarrito a la lista reservainfo
              this.reservainfo.push(reservaCarrito);



          } else {
              console.log(`No se encontró la habitación correspondiente a la reserva con ID ${reservaEncontrada.IdReservacion}`);
          }
      }
      console.log(this.reservainfo);
      this.calculartotal();



        },
        error => {
          console.error(error);
        }
      );

      // Recorrer todas las reservas encontradas y agregarlas a reservainfo
      
} else {
  // Manejar el caso en que no se encuentren reservas
  console.log('No se encontraron reservas con el ID especificado');
}
    
  }
  obtenerHabitaciones() {
    this._hotelService.getHabitaciones().subscribe(
      response => {
        this.Habitaciones = response.habitaciones;
      },
      error => {
        console.error(error);
      }
    );
  } 
  calcularprecio_noches(n1:number,n2:number): number {
    let precio_noches = 0;
    precio_noches=n1*n2;
    return precio_noches;
  }
  calculartotal(): void {
    for (const reserva of this.reservainfo) {
      this.subtotal += reserva.precioTotal;
      console.log(this.subtotal)
    }
    this.iva=this.subtotal*0.12;
    console.log("terminado el for",this.subtotal)
    console.log("iva",this.iva)
    this.precio=this.iva+this.subtotal;
  }
}


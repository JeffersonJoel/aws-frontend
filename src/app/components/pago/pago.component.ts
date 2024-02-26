import { Component, OnInit } from "@angular/core";
import { IPayPalConfig,ICreateOrderRequest } from "ngx-paypal";
import { Cliente } from "src/app/models/cliente";
import { Reservacion } from "src/app/models/reservacion";
import { DatosService } from "src/app/services/datos";
import { HotelService } from "src/app/services/hotel.service";
import { Global } from 'src/app/services/global';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css','./pago.responsive.css'],
  providers: [HotelService]
})
export class PagoComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  public showPaypalButtons ;
  public precio ;
  public carrito: any[] = [];

  public nuevaReservacion: Reservacion[] = [];
  public nuevoCliente: Cliente;
  public url:string;
  public iva:number;
  public subtotal:number;

  constructor(private _hotelService: HotelService, private datosService: DatosService) {
    this.showPaypalButtons=true;
    this.precio=0;
    this.nuevoCliente=new Cliente('hola','','','','','','');
    this.url = Global.url;
    this.iva=0;
    this.subtotal=0;
  }

  ngOnInit() {
    this.datosService.carrito$.subscribe(carrito => this.carrito = carrito);
    this.datosService.nuevaReservacion$.subscribe(reservacion => this.nuevaReservacion = reservacion);
    this.datosService.nuevoCliente$.subscribe(cliente => this.nuevoCliente = cliente);
    
    console.log("Datos del cliente:", this.nuevoCliente);
    console.log("Datos del carrito:", this.carrito); // Agregar console.log aquí
    console.log("Datos de la reservación:", this.nuevaReservacion); // Agregar console.log aquí
    this.calculartotal();
    this.initConfig();
}
private initConfig(): void {
  this.payPalConfig = {
      currency: 'USD',
      clientId: 'AVy33ubc5jqAgsEgNL9GduwZT0-e6m3ue4bju26nGlSMtXt1uvCuDPOUfQlu75JU6fV2E2Up9C8jEkCA',
      createOrderOnClient: (data) => < ICreateOrderRequest > {
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                  currency_code: 'USD',
                  value: this.precio.toString(),
                  breakdown: {
                      item_total: {
                          currency_code: 'USD',
                          value: this.precio.toString(),
                      }
                  }
              },
              items: [{
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                      currency_code: 'USD',
                      value: this.precio.toString(),
                  },
              }]
          }]
      },
      advanced: {
          commit: 'true'
      },
      style: {
          label: 'paypal',
          layout: 'vertical'
      },
      onApprove: (data, actions) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get().then((details: any)=> {
              console.log('onApprove - you can get full order details inside onApprove: ', details);
              this.realizarReserva();
          });

      },
      onClientAuthorization: (data) => {
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
          
      },
      onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
          

      },
      onError: err => {
          console.log('OnError', err);
      },
      onClick: (data, actions) => {
          console.log('onClick', data, actions);
         
  },
}
}


  realizarReserva(): void {
    for (const reserva of this.nuevaReservacion) {
      
      reserva.IDCliente=this.nuevoCliente._id;
      reserva.EstadoReservacion='Registrado';
      reserva.EstadoPago='Completado';
      reserva.IdReservacion=this.nuevoCliente._id+'reserva'
      
      this._hotelService.saveReservacion(reserva).subscribe(
        response => {
          console.log("se guardo en la base de datos");
        },
        error => {
            console.error(error);
        }
    );
  
    }

   

  alert('¡Transacción realizada con éxito!');
    
    
  }

  calcularprecio_noches(n1:number,n2:number): number {
    let precio_noches = 0;
    precio_noches=n1*n2;
    return precio_noches;
  }

  calculartotal(): void {
    for (const reserva of this.carrito) {
      this.subtotal += reserva.precioTotal;
      console.log(this.subtotal)
    }
    this.iva=this.subtotal*0.12;
    console.log("terminado el for",this.subtotal)
    console.log("iva",this.iva)
    this.precio=this.iva+this.subtotal;
  }
}

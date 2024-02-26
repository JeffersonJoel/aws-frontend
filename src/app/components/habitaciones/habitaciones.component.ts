import { Component, OnInit } from '@angular/core';
import { Habitacion } from 'src/app/models/habitacion';
import { Reservacion } from 'src/app/models/reservacion';
import { Global } from 'src/app/services/global';
import { HotelService } from 'src/app/services/hotel.service';
import { DatosService } from 'src/app/services/datos';
import { Router } from '@angular/router'; // Importa el servicio Router
@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css','./habitaciones.responsive.css'],
  providers: [HotelService]
})
export class HabitacionesComponent implements OnInit {
  public Habitaciones: Habitacion[];
  public HabitacionesFiltradas: Habitacion[];
  public Reservaciones: Reservacion[];
  public url: string;
  public checkInDate: string;  // Inicializar checkInDate
  public checkOutDate: string; // Inicializar checkOutDate
  public cantidadHuespedes: number;
  public minPrecio: number;
  public maxPrecio: number;
  public habitacionesEstado: any[] = [];
  
  tipoHabitacion = {
    suite: false,
    doble: false,
    cuadruple: false,
    // Agrega más propiedades según sea necesario
  };
  public carrito: any[] = [];
  public NuevaReservacion: Reservacion[] = [];

  tipoAlojamiento = {
    casa: false,
    cabana: false,
    // Agrega más propiedades según sea necesario
  };
  tipoCama = {
    extraGrande: false,
    grande: false,
    individual: false,
    // Agrega más propiedades según sea necesario
  };

  constructor(private _hotelService: HotelService,private datosService: DatosService,private router: Router) {
    this.url = Global.url;
    this.Habitaciones = [];
    this.Reservaciones = [];
    this.HabitacionesFiltradas= [];
    this.cantidadHuespedes = 1; // Valor predeterminado
    this.minPrecio = 0; // Valor predeterminado
    this.maxPrecio = 1000; // Valor predeterminado
    // Inicializa el campo Check In con la fecha de hoy
    this.checkInDate = this.getCurrentDate();

    console.log("habitaciones estado:",this.habitacionesEstado)
    // Inicializa el campo Check Out con la fecha de mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.checkOutDate = this.formatDate(tomorrow);
  }

  ngOnInit(): void {
     // Llamamos a las funciones que obtienen habitaciones y reservaciones
  this.obtenerHabitaciones();
  this.obtenerReservaciones();

  // Luego, llamamos a la función buscar
  
  }
  inicializarHabitacionesEstado() {
    this.habitacionesEstado = this.HabitacionesFiltradas.map(() => ({
      desayunoSeleccionado: false,
      adultos: 0,
      ninos: 0
    }));
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
  obtenerReservaciones() {
    this._hotelService.getReservaciones().subscribe(
      response => {
        this.Reservaciones = response.reservaciones;
        this.buscar();
      },
      error => {
        console.error(error);
      }
    );
    
  }
  formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const year = date.getFullYear();

    // Asegúrate de agregar un cero delante de los días y meses menores a 10
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;

    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  getCurrentDate(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Los meses en JavaScript son 0-indexados
    const year = today.getFullYear();

    // Formato de fecha YYYY-MM-DD para el atributo 'min'
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return formattedDate;
  }


buscar() {
  console.log('Check In:', this.checkInDate);
  console.log('Check Out:', this.checkOutDate);

  // Obtener las reservaciones en el rango de fechas
  const reservacionesEnRango = this.getReservacionesEnRango(
    this.checkInDate,
    this.checkOutDate
  );

  console.log('Reservaciones en rango:', reservacionesEnRango);

  // Lógica para obtener IDHabitacion de reservaciones en el rango de fechas
  const idHabitacionesReservadas = new Set<string>();

  reservacionesEnRango.forEach(reservacion => {
    idHabitacionesReservadas.add(reservacion.IDHabitacion);
  });

  console.log('ID Habitaciones Reservadas:', idHabitacionesReservadas);

  // Filtrar habitaciones disponibles excluyendo las reservadas
  this.HabitacionesFiltradas = this.Habitaciones.filter(
    habitacion => !idHabitacionesReservadas.has(habitacion._id)
  );


  
  this.filtrarPorPreferencias();

  // Filtrar por Cantidad de Huéspedes (CapacidadMaxima)
  if (!isNaN(this.cantidadHuespedes)) {
    this.HabitacionesFiltradas = this.HabitacionesFiltradas.filter(
      habitacion => habitacion.CapacidadMaxima >= this.cantidadHuespedes
    );
  }

  // Filtrar por Rango de Precio
  if (!isNaN(this.minPrecio) && !isNaN(this.maxPrecio)) {
    this.HabitacionesFiltradas = this.HabitacionesFiltradas.filter(
      habitacion => habitacion.Precio >= this.minPrecio && habitacion.Precio <= this.maxPrecio
    );
  }

  // Filtrar habitaciones disponibles excluyendo las reservadas y las del carrito
  this.HabitacionesFiltradas = this.HabitacionesFiltradas.filter(habitacion => {
    const habitacionEnCarrito = this.carrito.some(reserva => reserva.idHabitacion === habitacion._id);
    const habitacionReservada = idHabitacionesReservadas.has(habitacion._id);
    
    return !habitacionEnCarrito && !habitacionReservada;
  });
  console.log('Habitaciones después de filtrar:', this.Habitaciones);
console.log('HabitacionesFiltradas después de filtrar:', this.HabitacionesFiltradas);
}

filtrarPorPreferencias() {
  // Filtrar por tipo de habitación solo si al menos una casilla está seleccionada
  if (this.tipoHabitacion.suite || this.tipoHabitacion.doble || this.tipoHabitacion.cuadruple) {
    this.HabitacionesFiltradas = this.HabitacionesFiltradas.filter(
      habitacion => (this.tipoHabitacion.suite && habitacion.TipoHabitacion === 'Suite') ||
                     (this.tipoHabitacion.doble && habitacion.TipoHabitacion === 'Doble') ||
                     (this.tipoHabitacion.cuadruple && habitacion.TipoHabitacion === 'Cuádruple')
      // Agrega más condiciones según sea necesario
    );
    
  }

  // Filtrar por tipo de alojamiento solo si al menos una casilla está seleccionada
  if (this.tipoAlojamiento.casa || this.tipoAlojamiento.cabana) {
    this.HabitacionesFiltradas = this.HabitacionesFiltradas.filter(
      habitacion => (this.tipoAlojamiento.casa && habitacion.TipoAlojamiento === 'Casa') ||
                     (this.tipoAlojamiento.cabana && habitacion.TipoAlojamiento === 'Cabaña')
      // Agrega más condiciones según sea necesario
    );
  }

  // Filtrar por tipo de cama solo si al menos una casilla está seleccionada
  if (this.tipoCama.extraGrande || this.tipoCama.grande || this.tipoCama.individual) {
    this.HabitacionesFiltradas = this.HabitacionesFiltradas.filter(
      habitacion => (this.tipoCama.extraGrande && habitacion.TipoCamas === 'Extra-grande') ||
                     (this.tipoCama.grande && habitacion.TipoCamas === 'Grande') ||
                     (this.tipoCama.individual && habitacion.TipoCamas === 'Individual')
      // Agrega más condiciones según sea necesario
    );
  }
  this.inicializarHabitacionesEstado()
}




getReservacionesEnRango(fechaCheckIn: string, fechaCheckOut: string): Reservacion[] {
  const reservacionesEnRango = this.Reservaciones.filter(reservacion => {
    console.log(
      'FechaCheckIn Reservacion:', reservacion.FechaCheckIn,
      'FechaCheckOut Reservacion:', reservacion.FechaCheckOut,
      'FechaCheckIn Seleccionada:', fechaCheckIn,
      'FechaCheckOut Seleccionada:', fechaCheckOut
    );

    const seSuperponen = this.fechasSeSuperponen(
      reservacion.FechaCheckIn,
      reservacion.FechaCheckOut,
      fechaCheckIn,
      fechaCheckOut
    );

    console.log(`Reservacion ID: ${reservacion._id}, Se superponen: ${seSuperponen}`);
    
    return seSuperponen;
  });

  console.log('Reservaciones en rango:', reservacionesEnRango);
  
  return reservacionesEnRango;
}


fechasSeSuperponen(
  fechaInicio1: string,
  fechaFin1: string,
  fechaInicio2: string,
  fechaFin2: string
): boolean {
  const inicio1 = new Date(fechaInicio1).getTime();
  const fin1 = new Date(fechaFin1).getTime();
  const inicio2 = new Date(fechaInicio2).getTime();
  const fin2 = new Date(fechaFin2).getTime();

  return (inicio1 <= fin2 && fin1 >= inicio2);
}




anadir(habitacion: Habitacion,index: number) {
  const estadoHabitacion = this.habitacionesEstado[index];

  const fechaCheckIn = this.checkInDate;
  const fechaCheckOut = this.checkOutDate;
  const diffTime = Math.abs(new Date(fechaCheckOut).getTime() - new Date(fechaCheckIn).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const precioTotal = habitacion.Precio * diffDays;

  const fechaReservacion = new Date().toISOString().split('T')[0];

  const nuevaReservacion = new Reservacion(
      "",
      "",
      habitacion._id,
      estadoHabitacion.adultos, // Utilizar el número de adultos del estado de la habitación
      estadoHabitacion.ninos,   // Utilizar el número de niños del estado de la habitación
      fechaCheckIn,
      fechaCheckOut,
      estadoHabitacion.desayunoSeleccionado, // Utilizamos el estado del checkbox del desayuno
      "proceso",
      "",
      fechaReservacion,
      "",
      precioTotal,
      ""
  );



  const reservaCarrito = {
    id: '', // Opcional: puedes asignar un ID único a cada reserva si lo necesitas
    idHabitacion: habitacion._id,
    numAdultos:estadoHabitacion.adultos,
    numNinos: estadoHabitacion.ninos, 
    fechaCheckIn: fechaCheckIn,
    fechaCheckOut: fechaCheckOut,
    desayuno: estadoHabitacion.desayunoSeleccionado,
    estadoReservacion: 'proceso',
    fechaReservacion: fechaReservacion,
    preciopornoche:habitacion.Precio,
    precioTotal: precioTotal,
    imagen: habitacion.Imagen,
    n_noches:diffDays,
    tipoHabitacion: habitacion.TipoHabitacion,
    tipoAlojamiento: habitacion.TipoAlojamiento
  };
  if (reservaCarrito.desayuno) {
    reservaCarrito.precioTotal+=7;
    nuevaReservacion.PrecioTotal+=7;
  }
  this.NuevaReservacion.push(nuevaReservacion);

  this.carrito.push(reservaCarrito);
  console.log('Nueva reservación:', this.NuevaReservacion); // Agrega este console.log para imprimir la nueva reservación
// Eliminar las habitaciones que están en el carrito
this.HabitacionesFiltradas = this.HabitacionesFiltradas.filter(
  habitacion => !this.habitacionEnCarrito(habitacion._id)
);

this.inicializarHabitacionesEstado()
}



habitacionEnCarrito(idHabitacion: string): boolean {
  // Verificar si la habitación con el ID dado está en el carrito
  return this.carrito.some(reserva => reserva.idHabitacion === idHabitacion);
}

// Verifica si el número de adultos y niños es mayor o igual a 1
anadirHabilitado(index: number): boolean {
  const estadoHabitacion = this.habitacionesEstado[index];
  return estadoHabitacion.adultos >= 1;
}


verificarCapacidadMaxima(index: number): boolean {
  const habitacion = this.HabitacionesFiltradas[index];
  const estadoHabitacion = this.habitacionesEstado[index];
  const totalHuespedes = estadoHabitacion.adultos + estadoHabitacion.ninos;
  return totalHuespedes <= habitacion.CapacidadMaxima;
}

calcularSubtotal(): number {
  let subtotal = 0;
  for (const reserva of this.carrito) {
    subtotal += reserva.precioTotal;
  }
  return subtotal;
}

enviarDatos() {
  this.datosService.actualizarCarrito(this.carrito);
  this.datosService.actualizarNuevaReservacion(this.NuevaReservacion);
  this.router.navigate(['/formulario']);
}
}
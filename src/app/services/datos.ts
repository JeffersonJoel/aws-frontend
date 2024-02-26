import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reservacion } from '../models/reservacion';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private carritoSource = new BehaviorSubject<any[]>([]);
  carrito$ = this.carritoSource.asObservable();

  private nuevaReservacionSource = new BehaviorSubject<Reservacion[]>([]);
  nuevaReservacion$ = this.nuevaReservacionSource.asObservable();

  private nuevoClienteSource = new BehaviorSubject<Cliente>(new Cliente('','','','','','',''));
  nuevoCliente$ = this.nuevoClienteSource.asObservable();

  constructor() { }

  actualizarCarrito(carrito: any[]) {
    this.carritoSource.next(carrito);
  }

  actualizarNuevaReservacion(nuevaReservacion: Reservacion[]) {
    this.nuevaReservacionSource.next(nuevaReservacion);
  }
  actualizarNuevoCliente(nuevoCliente: Cliente) {
    this.nuevoClienteSource.next(nuevoCliente);
  }
}
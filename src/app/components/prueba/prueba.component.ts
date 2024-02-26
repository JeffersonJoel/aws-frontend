import { Component, OnInit } from '@angular/core';
import { Habitacion } from 'src/app/models/habitacion';
import { Global } from 'src/app/services/global';
import { HotelService } from 'src/app/services/hotel.service';
@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css'],
  providers:[HotelService]
})
export class PruebaComponent implements OnInit{
  public Habitaciones:Habitacion[];
  public url:string;


  constructor(
    private _hotelService:HotelService
  ) {
    this.url=Global.url;
    this.Habitaciones=[];
   }

  ngOnInit(): void {
    this.obtenerHabitaciones()
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


    
}

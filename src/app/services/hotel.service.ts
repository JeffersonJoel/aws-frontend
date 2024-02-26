import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Habitacion } from '../models/habitacion';
import { Reservacion } from '../models/reservacion';
import { Cliente } from '../models/cliente';
import { Global } from './global';
import { Observable } from 'rxjs';

@Injectable()
export class HotelService{
    public url:string;
    constructor(
        private _http:HttpClient
    ){
        this.url=Global.url;
    }
    getHabitaciones():Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'habitaciones',{headers:headers});
    }
    guardarHabitacion(habitacion:Habitacion):Observable<any>{
        let params=JSON.stringify(habitacion);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'guardar-habitacion',params,{headers:headers});
    }
    getHabitacion(id:String):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'habitacion/'+id,{headers:headers});
    }
    updateHabitacion(habitacion:Habitacion):Observable<any>{
        let params=JSON.stringify(habitacion);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.put(this.url+'habitacion/'+habitacion._id,params,{headers:headers});
    }
    //eliminar un habitacion
    //http://localhost:3600/habitacion/:id
    deleteHabitacion(id:String):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.delete(this.url+'habitacion/'+id,{headers:headers});
    }


    getReservaciones():Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'reservaciones',{headers:headers});
    }
    guardarReservacion(reservacion:Reservacion):Observable<any>{
        let params=JSON.stringify(reservacion);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'guardar-reservacion',params,{headers:headers});
    }
    getReservacion(id:String):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'reservacion/'+id,{headers:headers});
    }
    updateReservacion(reservacion:Reservacion):Observable<any>{
        let params=JSON.stringify(reservacion);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.put(this.url+'reservacion/'+reservacion._id,params,{headers:headers});
    }
    deleteReservacion(id:String):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.delete(this.url+'reservacion/'+id,{headers:headers});
    }





    getClientes():Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'clientes',{headers:headers});
    }
    getCliente(id:string):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'cliente/'+id,{headers:headers});
    }
    saveCliente(cliente:Cliente):Observable<any>{
        let params=JSON.stringify(cliente);
        console.log(params);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'guardar-cliente',params,{headers:headers});
    }
    saveReservacion(reservacion:Reservacion):Observable<any>{
        let params=JSON.stringify(reservacion);
        console.log(params);
        let headers=new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'guardar-reservacion',params,{headers:headers});
    }
    
}
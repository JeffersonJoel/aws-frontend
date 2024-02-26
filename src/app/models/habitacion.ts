export class Habitacion{
    constructor(
        public _id:string,
        public NumeroHabitacion:number,
        public TipoHabitacion:string,
        public CapacidadMaxima:number,
        public TipoCamas:string,
        public Precio: number,
        public Disponibilidad:Boolean,
        public TipoAlojamiento:string,
        public Imagen:string
    ){}
}

export class Reservacion{
    constructor(
        public _id: string,
        public IDCliente: string,
        public IDHabitacion: string,  // Cambiado a string
        public NumAdultos: number,
        public NumNinos: number,
        public FechaCheckIn: string,   // Cambiado a string
        public FechaCheckOut: string,  // Cambiado a string
        public Desayuno: boolean,
        public EstadoReservacion: string,
        public EstadoPago: string,
        public FechaReservacion: string,
        public FechaCancelacion: string,
        public PrecioTotal: number,
        public IdReservacion: string,
    ){}
}

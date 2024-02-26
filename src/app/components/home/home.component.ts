import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css','./home.responsive.css']
})
export class HomeComponent {
  getCurrentDate(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Los meses en JavaScript son 0-indexados
    const year = today.getFullYear();

    // Formato de fecha YYYY-MM-DD para el atributo 'min'
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return formattedDate;
  }

  constructor(private router: Router) { }

  buscar() {
    // Navegar a la página de habitaciones al hacer clic en el botón
    this.router.navigate(['/habitaciones']);
  }
}

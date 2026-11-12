import { Component } from '@angular/core';

@Component({
  selector: 'app-presentacion-jaime',
  templateUrl: './presentacion-jaime.component.html',
  styleUrls: ['./presentacion-jaime.component.scss']
})
export class PresentacionJaimeComponent {
  inicial = 'J';
  etiqueta = 'Estudiante';
  nombre = 'Jaime Alberto García Escobedo';
  subtitulo = 'Presentación personal';
  datos = [
    { label: 'Correo', valor: 'Jicamanub3@gmail.com' },
    { label: 'Número', valor: '8441309683' }
  ];
  ubicacion = 'Ramos Arizpe Coahuila';
}

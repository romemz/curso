import { Component } from '@angular/core';

@Component({
  selector: 'app-presentacion-jahir',
  templateUrl: './presentacion-jahir.component.html',
  styleUrls: ['./presentacion-jahir.component.scss']
})
export class PresentacionJahirComponent {
  nombre = 'Hola soy Jahir Moroles';
  tagline = 'Me encanta crear y compartir cosas que emocionan.';
  gustos = ['Videojuegos', 'Fútbol', 'Música', 'Cocina'];
  whatsapp = '8445375897';
  whatsappTexto = 'WhatsApp: 844 537 5897';
}

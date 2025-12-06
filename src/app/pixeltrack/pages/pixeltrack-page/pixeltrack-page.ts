import { Component, OnInit } from '@angular/core';
import { BoardComponent } from '../../components/board/board.component';
import { KeyBoardComponent } from '../../components/key-board/key-board.component';
import { AlbumImageComponent } from '../../components/album-image/album-image.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-pixeltrack-page',
  imports: [BoardComponent, KeyBoardComponent, AlbumImageComponent, NavbarComponent],
  templateUrl: './pixeltrack-page.html',
  styleUrl: './pixeltrack-page.css',
})
export class PixeltrackPage implements OnInit {

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    console.log('Buscando un artista aleatorio...');
    
    this.spotifyService.getRandomArtist().subscribe({
      next: (artist) => {
        if (artist) {
          console.log('¡ÉXITO! Artista aleatorio encontrado:', artist);
          console.log('Nombre:', artist.name);
          console.log('Popularidad:', artist.popularity);
          console.log('Imagen:', artist.images[0]?.url);
        } else {
          console.warn('No se encontró ningún artista con los criterios aleatorios.');
        }
      },
      error: (err) => {
        console.error('Error al buscar artista aleatorio:', err);
      }
    });
  }

}

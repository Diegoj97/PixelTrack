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
    console.log('Intentando obtener token...');
    this.spotifyService.getToken().subscribe({
      next: (token) => {
        console.log('¡ÉXITO! Token obtenido:', token);
      },
      error: (err) => {
        console.error('FALLO al obtener token:', err);
      }
    });
  }

}

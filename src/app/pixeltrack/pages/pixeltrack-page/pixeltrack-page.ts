import { Component, OnInit, ViewChild } from '@angular/core';
import { BoardComponent } from '../../components/board/board.component';
import { KeyBoardComponent } from '../../components/key-board/key-board.component';
import { AlbumImageComponent } from '../../components/album-image/album-image.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SpotifyService } from '../../services/spotify.service';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-pixeltrack-page',
  imports: [BoardComponent, KeyBoardComponent, AlbumImageComponent, NavbarComponent],
  templateUrl: './pixeltrack-page.html',
  styleUrl: './pixeltrack-page.css',
})
export class PixeltrackPage implements OnInit {

  @ViewChild(BoardComponent) boardComponent!: BoardComponent;

  currentAlbumImage: string | null = null;
  currentGenre: string | null = null;
  currentArtistName: string | null = null;
  keyStatuses: { [key: string]: string } = {};
  currentBlur: number = 15;
  
  // Conjunto para rastrear índices de letras descubiertas correctamente
  private discoveredIndices: Set<number> = new Set();

  constructor(
    private spotifyService: SpotifyService,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        console.log('Banderas cargadas:', countries);
      },
      error: (err) => {
        console.error('Error al cargar banderas:', err);
      }
    });

    console.log('Buscando un artista aleatorio...');
    
    this.spotifyService.getRandomArtist().subscribe({
      next: (result) => {
        if (result) {
          const { artist, album } = result;
          console.log('¡ÉXITO! Artista aleatorio encontrado:', artist);
          console.log('Nombre:', artist.name);
          console.log('Popularidad:', artist.popularity);
          console.log('Imagen:', artist.images[0]?.url);
          console.log('Album seleccionado:', album.name);

          if (album.images && album.images.length > 0) {
            this.currentAlbumImage = album.images[0].url;
          }

          if (artist.genres && artist.genres.length > 0) {
            // Mostrar solo el primer género
            this.currentGenre = artist.genres[0];
          } else {
            this.currentGenre = 'Género desconocido';
          }

          this.currentArtistName = artist.name;
          this.currentBlur = 15; // Resetear blur
          this.discoveredIndices.clear(); // Resetear índices descubiertos
        } else {
          console.warn('No se encontró ningún artista con los criterios aleatorios.');
        }
      },
      error: (err) => {
        console.error('Error al buscar artista aleatorio:', err);
      }
    });
  }

  onKeyPress(key: string) {
    if (this.boardComponent) {
      this.boardComponent.handleKeyPress(key);
    }
  }

  onGuessChecked(guessStatus: { [key: string]: string }, row?: any[]) {
    // Actualizar el estado de las teclas
    // Prioridad: correct > present > absent
    const newStatuses = { ...this.keyStatuses };

    for (const [key, status] of Object.entries(guessStatus)) {
      const currentStatus = newStatuses[key];

      if (status === 'correct') {
        newStatuses[key] = 'correct';
      } else if (status === 'present' && currentStatus !== 'correct') {
        newStatuses[key] = 'present';
      } else if (status === 'absent' && currentStatus !== 'correct' && currentStatus !== 'present') {
        newStatuses[key] = 'absent';
      }
    }

    this.keyStatuses = newStatuses;

    // Calcular reducción de blur si tenemos la fila
    if (row && this.currentArtistName) {
      this.updateBlur(row);
    }
  }

  updateBlur(row: any[]) {
    if (!this.currentArtistName) return;

    // Identificar nuevas letras correctas en su posición
    row.forEach((cell, index) => {
      if (!cell.isSpace && cell.status === 'correct') {
        this.discoveredIndices.add(index);
      }
    });

    // Calcular el porcentaje de letras descubiertas
    // Contamos solo caracteres que no son espacios
    const totalChars = this.currentArtistName.replace(/ /g, '').length;
    const discoveredCount = this.discoveredIndices.size;

    if (totalChars > 0) {
      const percentageDiscovered = discoveredCount / totalChars;
      
      // Reducir el blur proporcionalmente
      // Blur inicial: 15, Blur final: 0
      this.currentBlur = Math.max(0, 15 * (1 - percentageDiscovered));
    }
  }

}

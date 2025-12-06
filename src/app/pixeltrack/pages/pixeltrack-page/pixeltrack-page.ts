import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BoardComponent } from '../../components/board/board.component';
import { KeyBoardComponent } from '../../components/key-board/key-board.component';
import { AlbumImageComponent } from '../../components/album-image/album-image.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { SpotifyService } from '../../services/spotify.service';
import { CountriesService } from '../../services/countries.service';
import { CommonModule } from '@angular/common';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-pixeltrack-page',
  imports: [BoardComponent, KeyBoardComponent, AlbumImageComponent, NavbarComponent, CountryListComponent, CommonModule],
  templateUrl: './pixeltrack-page.html',
  styleUrl: './pixeltrack-page.css',
})
export class PixeltrackPage implements OnInit {

  @ViewChild(BoardComponent) boardComponent!: BoardComponent;

  currentAlbumImage: string | null = null;
  currentGenre: string | null = null;
  currentInfoLabel: string = 'Género';
  currentArtistName: string | null = null;
  currentAlbumName: string | null = null;
  currentAlbumUrl: string | null = null;
  currentPreviewUrl: string | null = null;
  currentSpotifyEmbedUrl: SafeResourceUrl | null = null;
  
  // Audio Player State
  isPlaying: boolean = false;
  audioProgress: number = 0;
  
  keyStatuses: { [key: string]: string } = {};
  currentBlur: number = 15;
  showCountryList: boolean = false;

  currentLang: string = 'ES';
  currentFlag: string | null = null;
  
  // Conjunto para rastrear índices de letras descubiertas correctamente
  private discoveredIndices: Set<number> = new Set();

  constructor(
    private spotifyService: SpotifyService,
    private countriesService: CountriesService,
    private sanitizer: DomSanitizer
  ) {}

  toggleCountryList(): void {
    this.showCountryList = !this.showCountryList;
  }

  onCountrySelected(country: Country): void {
    this.currentLang = country.cca2;
    this.currentFlag = country.flags.svg;
    this.showCountryList = false;
    this.loadRandomArtist(this.currentLang);
  }

  loadRandomArtist(countryCode?: string): void {
    console.log('Buscando un artista aleatorio...', countryCode ? `para el mercado: ${countryCode}` : '');
    // Resetear estado del juego
    this.currentAlbumImage = null;
    this.currentGenre = null;
    this.currentInfoLabel = 'Género';
    this.currentArtistName = null;
    this.currentAlbumName = null;
    this.currentAlbumUrl = null;
    this.currentPreviewUrl = null;
    this.currentSpotifyEmbedUrl = null;
    this.isPlaying = false;
    this.audioProgress = 0;
    this.keyStatuses = {};
    this.currentBlur = 15;
    this.discoveredIndices.clear();
    if (this.boardComponent) {
      // Idealmente deberíamos tener un método para resetear el tablero, 
      // pero por ahora Angular recreará el componente si cambiamos la palabra o forzamos actualización.
      // Al cambiar currentArtistName a null y luego al nuevo valor, el tablero debería reaccionar si usa ngOnChanges o signals.
      // Si no, necesitaremos un método reset en BoardComponent.
    }

    this.spotifyService.getRandomArtist(countryCode).subscribe({
      next: (result) => {
        if (result) {
          const { artist, album } = result;
          console.log('¡ÉXITO! Artista aleatorio encontrado:', artist);
          console.log('Nombre:', artist.name);
          console.log('Imagen:', artist.images[0]?.url);
          console.log('Album seleccionado:', album.name);
          this.currentAlbumName = album.name;
          this.currentAlbumUrl = album.external_urls.spotify;

          // Buscar tracks del álbum para obtener preview
          this.spotifyService.getAlbumTracks(album.id).subscribe({
            next: (tracks) => {
              console.log(`Tracks totales del álbum: ${tracks.length}`);

              if (tracks.length > 0) {
                // Siempre generar el Embed como opción
                const randomTrackForEmbed = tracks[Math.floor(Math.random() * tracks.length)];
                const embedUrl = `https://open.spotify.com/embed/track/${randomTrackForEmbed.id}?utm_source=generator&theme=0`;
                this.currentSpotifyEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
              }

              // Filtrar tracks que tengan preview_url
              const tracksWithPreview = tracks.filter(t => t.preview_url);
              if (tracksWithPreview.length > 0) {
                // Seleccionar uno aleatorio
                const randomTrack = tracksWithPreview[Math.floor(Math.random() * tracksWithPreview.length)];
                this.currentPreviewUrl = randomTrack.preview_url;
                console.log('Preview URL encontrada:', this.currentPreviewUrl);
              } else {
                console.warn('No se encontraron tracks con preview para este álbum.');
              }
            },
            error: (err) => console.error('Error al obtener tracks:', err)
          });

          if (album.images && album.images.length > 0) {
            this.currentAlbumImage = album.images[0].url;
          }
          if (artist.genres && artist.genres.length > 0) {
            // Mostrar solo el primer género
            this.currentGenre = artist.genres[0];
            this.currentInfoLabel = 'Género';
          } else if (album.release_date) {
            // Si no hay género, mostrar el año de lanzamiento
            this.currentGenre = album.release_date.split('-')[0];
            this.currentInfoLabel = 'Publicación';
          } else {
            this.currentGenre = 'Desconocido';
            this.currentInfoLabel = 'Info';
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

  ngOnInit(): void {
    // Initialize language based on navigator
    const lang = navigator.language.split('-')[0].toUpperCase();
    this.currentLang = lang;
    
    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        console.log('Banderas cargadas:', countries);
        
        // Buscar si el idioma actual está en la lista de países para poner la bandera
        const foundCountry = countries.find(c => c.cca2 === this.currentLang);
        if (foundCountry) {
          this.currentFlag = foundCountry.flags.svg;
        }

        // Una vez cargados los países (y la bandera inicial), cargamos el artista
        this.loadRandomArtist(this.currentLang);
      },
      error: (err) => {
        console.error('Error al cargar banderas:', err);
        // Si falla la carga de banderas, intentamos cargar el artista de todas formas
        this.loadRandomArtist(this.currentLang);
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

  toggleAudio(audioElement: HTMLAudioElement): void {
    if (this.isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  updateProgress(audioElement: HTMLAudioElement): void {
    if (audioElement.duration) {
      this.audioProgress = (audioElement.currentTime / audioElement.duration) * 100;
    }
  }

  resetPlayer(): void {
    this.isPlaying = false;
    this.audioProgress = 0;
  }

}

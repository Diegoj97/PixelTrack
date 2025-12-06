import { Component } from '@angular/core';
import { BoardComponent } from '../../components/board/board.component';
import { KeyBoardComponent } from '../../components/key-board/key-board.component';
import { AlbumImageComponent } from '../../components/album-image/album-image.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-pixeltrack-page',
  imports: [BoardComponent, KeyBoardComponent, AlbumImageComponent, NavbarComponent],
  templateUrl: './pixeltrack-page.html',
  styleUrl: './pixeltrack-page.css',
})
export class PixeltrackPage {

}

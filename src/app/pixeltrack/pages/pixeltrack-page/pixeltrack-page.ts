import { Component } from '@angular/core';
import { BoardComponent } from '../../components/board/board.component';
import { KeyBoardComponent } from '../../components/key-board/key-board.component';

@Component({
  selector: 'app-pixeltrack-page',
  imports: [BoardComponent, KeyBoardComponent],
  templateUrl: './pixeltrack-page.html',
  styleUrl: './pixeltrack-page.css',
})
export class PixeltrackPage {

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-key-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-board.component.html',
  styleUrl: './key-board.component.css'
})
export class KeyBoardComponent {
  @Input() keyStatuses: { [key: string]: string } = {};
  @Output() keyPress = new EventEmitter<string>();

  rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['BACKSPACE', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
  ];

  onKeyPress(key: string) {
    this.keyPress.emit(key);
  }
}

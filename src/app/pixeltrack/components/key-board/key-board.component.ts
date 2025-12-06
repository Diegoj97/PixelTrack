import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-key-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-board.component.html',
  styleUrl: './key-board.component.css'
})
export class KeyBoardComponent implements OnChanges {
  @Input() keyStatuses: { [key: string]: string } = {};
  @Input() targetWord: string | null = null;
  @Output() keyPress = new EventEmitter<string>();

  defaultRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['BACKSPACE', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
  ];

  rows: string[][] = [];

  constructor() {
    this.resetKeyboard();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['targetWord']) {
      this.updateKeyboardLayout();
    }
  }

  resetKeyboard() {
    this.rows = this.defaultRows.map(row => [...row]);
  }

  updateKeyboardLayout() {
    this.resetKeyboard();
    
    if (!this.targetWord) return;

    const existingKeys = new Set(this.defaultRows.flat());
    const missingKeys = new Set<string>();

    const normalizedWord = this.targetWord.toUpperCase();
    
    for (const char of normalizedWord) {
        if (char === ' ') continue;
        if (!existingKeys.has(char)) {
            missingKeys.add(char);
        }
    }

    if (missingKeys.size > 0) {
        const sortedMissing = Array.from(missingKeys).sort();
        this.rows.unshift(sortedMissing);
    }
  }

  onKeyPress(key: string) {
    this.keyPress.emit(key);
  }
}

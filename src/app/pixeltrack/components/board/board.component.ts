import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnChanges {
  @Input() word: string | null = null;

  rows: any[][] = [];
  attempts: number = 5;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['word'] && this.word) {
      this.initializeBoard();
    }
  }

  initializeBoard() {
    if (!this.word) return;

    this.rows = [];
    const wordStructure = this.word.split('').map(char => ({
      char: char,
      isSpace: char === ' '
    }));

    for (let i = 0; i < this.attempts; i++) {
      this.rows.push([...wordStructure]); // Copia de la estructura para cada intento
    }
  }
}

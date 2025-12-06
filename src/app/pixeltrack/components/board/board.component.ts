import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
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
  @Output() guessChecked = new EventEmitter<{ status: { [key: string]: string }, row: any[] }>();

  rows: any[][] = [];
  attempts: number = 5;
  currentRowIndex: number = 0;
  currentCellIndex: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['word'] && this.word) {
      this.initializeBoard();
    }
  }

  initializeBoard() {
    if (!this.word) return;

    this.rows = [];
    this.currentRowIndex = 0;
    this.currentCellIndex = 0;

    const wordStructure = this.word.split('').map(char => ({
      char: char,
      isSpace: char === ' ',
      value: '', // Valor ingresado por el usuario
      status: 'default' // 'default', 'correct', 'present', 'absent'
    }));

    for (let i = 0; i < this.attempts; i++) {
      // Copia profunda para evitar referencias compartidas
      this.rows.push(JSON.parse(JSON.stringify(wordStructure)));
    }
  }

  handleKeyPress(key: string) {
    if (!this.word || this.currentRowIndex >= this.attempts) return;

    const currentRow = this.rows[this.currentRowIndex];

    if (key === 'ENTER') {
      this.submitGuess();
    } else if (key === 'BACKSPACE') {
      this.deleteLetter();
    } else {
      this.addLetter(key);
    }
  }

  addLetter(letter: string) {
    const currentRow = this.rows[this.currentRowIndex];
    
    // Buscar la siguiente celda vacía que no sea un espacio
    let nextIndex = -1;
    for (let i = 0; i < currentRow.length; i++) {
      if (!currentRow[i].isSpace && currentRow[i].value === '') {
        nextIndex = i;
        break;
      }
    }

    if (nextIndex !== -1) {
      currentRow[nextIndex].value = letter;
    }
  }

  deleteLetter() {
    const currentRow = this.rows[this.currentRowIndex];
    
    // Buscar la última celda llena que no sea un espacio
    let lastIndex = -1;
    for (let i = currentRow.length - 1; i >= 0; i--) {
      if (!currentRow[i].isSpace && currentRow[i].value !== '') {
        lastIndex = i;
        break;
      }
    }

    if (lastIndex !== -1) {
      currentRow[lastIndex].value = '';
    }
  }

  submitGuess() {
    const currentRow = this.rows[this.currentRowIndex];
    
    // Verificar si la fila está completa
    const isComplete = currentRow.every((cell: any) => cell.isSpace || cell.value !== '');
    
    if (isComplete) {
      this.checkRow(currentRow);
      this.currentRowIndex++;
    } else {
      console.log('Fila incompleta');
    }
  }

  checkRow(row: any[]) {
    if (!this.word) return;

    const targetWord = this.word.toUpperCase();
    const targetChars = targetWord.split('');
    const guessStatus: { [key: string]: string } = {};

    // Contadores para manejar letras repetidas
    const targetLetterCounts: { [key: string]: number } = {};
    targetChars.forEach(char => {
      if (char !== ' ') {
        targetLetterCounts[char] = (targetLetterCounts[char] || 0) + 1;
      }
    });

    // Primera pasada: Identificar aciertos (Verdes)
    row.forEach((cell, index) => {
      if (cell.isSpace) return;

      const letter = cell.value.toUpperCase();
      const targetChar = targetChars[index];

      if (letter === targetChar) {
        cell.status = 'correct';
        targetLetterCounts[letter]--;
        guessStatus[letter] = 'correct';
      }
    });

    // Segunda pasada: Identificar letras presentes pero mal ubicadas (Amarillas) y ausentes (Grises)
    row.forEach((cell, index) => {
      if (cell.isSpace || cell.status === 'correct') return;

      const letter = cell.value.toUpperCase();

      if (targetLetterCounts[letter] > 0) {
        cell.status = 'present';
        targetLetterCounts[letter]--;
        if (guessStatus[letter] !== 'correct') {
          guessStatus[letter] = 'present';
        }
      } else {
        cell.status = 'absent';
        if (!guessStatus[letter]) {
          guessStatus[letter] = 'absent';
        }
      }
    });

    this.guessChecked.emit({ status: guessStatus, row: row });
  }
}

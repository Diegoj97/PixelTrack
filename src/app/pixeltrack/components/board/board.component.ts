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
      // Aquí iría la lógica de validación (colores)
      console.log('Intento enviado:', currentRow.map((c: any) => c.value).join(''));
      this.currentRowIndex++;
    } else {
      console.log('Fila incompleta');
    }
  }
}

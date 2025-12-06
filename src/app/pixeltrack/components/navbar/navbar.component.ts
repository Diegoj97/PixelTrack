import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  @Input() currentLang: string = 'ES';
  @Input() currentFlag: string | null = null;
  @Input() hasAttempted: boolean = false;
  @Output() toggleFlags = new EventEmitter<void>();

  ngOnInit(): void {
    // Initialization logic moved to parent or handled via inputs
  }

  onToggleFlags(): void {
    this.toggleFlags.emit();
  }

}

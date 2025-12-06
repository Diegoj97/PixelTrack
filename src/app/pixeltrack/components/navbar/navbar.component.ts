import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  @Output() toggleFlags = new EventEmitter<void>();

  public currentLang: string = 'ES';
  public currentFlag: string = '🇪🇸';

  ngOnInit(): void {
    const lang = navigator.language.split('-')[0].toUpperCase();
    this.currentLang = lang;

    switch (lang) {
      case 'ES':
        this.currentFlag = '🇪🇸';
        break;
      case 'EN':
        this.currentFlag = '🇬🇧';
        break;
      default:
        this.currentFlag = '🌍';
    }
  }

  onToggleFlags(): void {
    this.toggleFlags.emit();
  }

}

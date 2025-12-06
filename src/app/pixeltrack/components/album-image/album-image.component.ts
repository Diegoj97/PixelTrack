import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-image.component.html',
  styleUrl: './album-image.component.css'
})
export class AlbumImageComponent {
  @Input() imageUrl: string | null = null;
  @Input() genre: string | null = null;
}

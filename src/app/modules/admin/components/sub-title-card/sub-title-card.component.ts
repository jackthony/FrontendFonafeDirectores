import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'fo-sub-title-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sub-title-card.component.html',
  styleUrl: './sub-title-card.component.scss'
})
export class SubTitleCardComponent {
    text = input.required<string>();
}

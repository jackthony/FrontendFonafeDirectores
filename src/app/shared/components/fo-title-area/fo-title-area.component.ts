import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'fo-title-area',
  standalone: true,
  imports: [],
  templateUrl: './fo-title-area.component.html',
  styleUrl: './fo-title-area.component.scss'
})
export class FoTitleAreaComponent {
    titleArea = input.required<string>();
}

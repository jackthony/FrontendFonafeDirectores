import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'fo-title-module',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fo-title-module.component.html',
  styleUrl: './fo-title-module.component.scss'
})
export class FoTitleModuleComponent {
    text = input.required<string>();
}

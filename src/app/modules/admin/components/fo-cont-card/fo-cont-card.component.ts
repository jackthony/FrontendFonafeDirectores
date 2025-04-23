import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { SubTitleCardComponent } from '@components/sub-title-card/sub-title-card.component';

@Component({
  selector: 'fo-cont-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, SubTitleCardComponent],
  templateUrl: './fo-cont-card.component.html',
  styleUrl: './fo-cont-card.component.scss'
})
export class FoContCardComponent {
    title = input<string>('');

    enabledPadding = input<boolean>(true);
}

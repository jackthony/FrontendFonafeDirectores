import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quit',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './quit.component.html',
  styleUrl: './quit.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class QuitComponent {

	private _router = inject(Router);

	signOut(): void {
        this._router.navigate(['/sign-out']);
    }
}

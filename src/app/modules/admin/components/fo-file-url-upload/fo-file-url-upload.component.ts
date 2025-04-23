import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-fo-file-url-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './fo-file-url-upload.component.html',
  styleUrl: './fo-file-url-upload.component.scss',
  //encapsulation: ViewEncapsulation.None
})
export class FoFileUrlUploadComponent {

}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, NgxSpinnerModule],
})
export class AppComponent {
    /**
     * Constructor
     */
}

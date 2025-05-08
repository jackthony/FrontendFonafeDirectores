import { Injectable, inject } from '@angular/core';
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root',
})
export class NgxToastrService {
    private readonly toastr = inject(ToastrService);

	showSuccess(message: string, tittle: string): void {
		this.toastr.success(message, tittle);
	}

	showError(message: string, tittle?: string): void {
		this.toastr.error(message, tittle);
	}
}

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../modules/user/domain/services/auth/auth.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { HttpStatusCodes } from 'app/shared/constants/http-status-codes';
import { showError0, showError400, showError403, showError404, showError500 } from 'app/shared/constants/http-error-message';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const toastr = inject(NgxToastrService);
	
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage;
            if (error.error instanceof ErrorEvent) {
                errorMessage = `Error: ${error.error.message}`;
            } else {
				errorMessage = error;
				if (error.status === HttpStatusCodes.BAD_REQUEST && error?.error.status === HttpStatusCodes.BAD_REQUEST) {
					// Mostrar un toast por cada error
					if (error.error.detail && error.error?.showToast) {
						toastr.showError(error.error.detail, 'Accion denegada');	
					}
				  }
				else if(error.status === HttpStatusCodes.UNAUTHORIZED){
					// Sign out
					authService.signOut();

					// Reload the app
					location.reload();
				} else if (error.status === HttpStatusCodes.CONNECTION){
					toastr.showError(showError0(), 'Error');
				} else if (error.status === HttpStatusCodes.BAD_REQUEST){
					toastr.showError(showError400(), 'Error');
				} else if (error.status === HttpStatusCodes.FORBIDDEN){
					toastr.showError(showError403(), 'Error');
				} else if (error.status === HttpStatusCodes.NOT_FOUND){
					toastr.showError(showError404(), 'Error');
				} else if (error.status === HttpStatusCodes.INTERNAL_SERVER_ERROR){
					toastr.showError(showError500(), 'Error');
				} else {
					toastr.showError(errorMessage);
				}
			}
            return throwError(() => errorMessage);
        })
    );
};

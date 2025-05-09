import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';

@Injectable({
    providedIn: 'root',
})
export class SegUserService<T> extends HttpGenericService<T> {
    constructor() {
        super(`${environment.apiUrlBase}/Usuario`);
    }
}

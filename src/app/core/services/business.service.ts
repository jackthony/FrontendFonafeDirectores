import { Injectable } from '@angular/core';
import { Business } from '@models/business/business.interface';
import { environment } from 'environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';
import { forkJoin } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BusinessService<T> extends HttpGenericService<T> {
    constructor() {
        super(`${environment.apiUrlBase}/EMP_Empresa`);
    }
}

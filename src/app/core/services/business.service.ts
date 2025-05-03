import { Injectable } from '@angular/core';
import { Business } from '@models/business/business.interface';
import { environment } from 'app/environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';

@Injectable({
    providedIn: 'root',
})
export class BusinessService extends HttpGenericService<Business> {
    constructor() {
        super(`${environment.apiUrlBase}/EMP_Empresa`);
    }
}

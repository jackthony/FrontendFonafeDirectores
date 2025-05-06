import { Injectable } from '@angular/core';

import { environment } from 'app/environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';
import { Province } from '@models/business/province.interface';

@Injectable({
    providedIn: 'root',
})
export class ProvinceService extends HttpGenericService<Province> {

    constructor() {
        super(`${environment.apiUrlBase}/Provincias`);
    }

}

import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';
import { District } from '@models/business/district.interface';

@Injectable({
    providedIn: 'root',
})
export class DistrictService extends HttpGenericService<District> {

    constructor() {
        super(`${environment.apiUrlBase}/Distritos`);
    }

}

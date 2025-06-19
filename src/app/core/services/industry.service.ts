import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';
import { Sector } from '@models/system-maintenance/sector.interface';
import { Industry } from '@models/system-maintenance/industry.interface';

@Injectable({
    providedIn: 'root',
})
export class IndustryService extends HttpGenericService<Industry> {
    
    constructor() {
        super(`${environment.apiUrlBase}/Rubro`);
    }
}

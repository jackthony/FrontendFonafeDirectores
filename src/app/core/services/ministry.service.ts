import { Injectable } from '@angular/core';
import { Business } from '@models/business/business.interface';
import { environment } from 'environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';
import { forkJoin } from 'rxjs';
import { Ministry } from '@models/system-maintenance/ministry.interface';

@Injectable({
    providedIn: 'root',
})
export class MinistryService extends HttpGenericService<Ministry> {
    
    constructor() {
        super(`${environment.apiUrlBase}/Cat_Ministerio`);
    }
}

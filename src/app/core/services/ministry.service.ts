import { Injectable } from '@angular/core';
import { Business } from '@models/business/business.interface';
import { Ministry } from '@models/business/ministry.interface';
import { environment } from 'app/environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';
import { forkJoin } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MinistryService extends HttpGenericService<Ministry> {
    
    constructor() {
        super(`${environment.apiUrlBase}/Cat_Ministerio`);
    }
}

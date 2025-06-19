import { Injectable } from '@angular/core';
import { Business } from '@models/business/business.interface';
import { environment } from 'environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';
import { forkJoin } from 'rxjs';
import { Ministry } from '@models/system-maintenance/ministry.interface';
import { Sector } from '@models/system-maintenance/sector.interface';

@Injectable({
    providedIn: 'root',
})
export class SectorService extends HttpGenericService<Sector> {
    
    constructor() {
        super(`${environment.apiUrlBase}/Sector`);
    }
}

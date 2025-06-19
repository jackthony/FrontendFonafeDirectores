import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';
import { Sector } from '@models/system-maintenance/sector.interface';
import { TypeDirector } from '@models/system-maintenance/type-director.interface';
import { Specialty } from '@models/system-maintenance/specialty.interface';

@Injectable({
    providedIn: 'root',
})
export class SpecialtyService extends HttpGenericService<Specialty> {
    
    constructor() {
        super(`${environment.apiUrlBase}/Especialidad`);
    }
}

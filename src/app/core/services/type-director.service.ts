import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';
import { Sector } from '@models/system-maintenance/sector.interface';
import { TypeDirector } from '@models/system-maintenance/type-director.interface';

@Injectable({
    providedIn: 'root',
})
export class TypeDirectorService extends HttpGenericService<TypeDirector> {
    
    constructor() {
        super(`${environment.apiUrlBase}/TypeDirector`);
    }
}

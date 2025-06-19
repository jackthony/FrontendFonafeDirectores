import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';
import { Sector } from '@models/system-maintenance/sector.interface';
import { Position } from '@models/system-maintenance/position.interface';

@Injectable({
    providedIn: 'root',
})
export class PositionService extends HttpGenericService<Position> {
    
    constructor() {
        super(`${environment.apiUrlBase}/Cargo`);
    }
}

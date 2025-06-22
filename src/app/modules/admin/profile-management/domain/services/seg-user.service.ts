import { Injectable } from '@angular/core';
import { SegUserInterface } from '../../application/repositories/seg-user.interface';
import { SegUserFactory } from '../../infrastructure/seg-user.factory';
import { Observable } from 'rxjs';
import { SegUserEntity } from '../entities/seg-user.entity';
import { SegUserChangePasswordEntity } from '../entities/seg-user-change-password.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';

@Injectable({
    providedIn: 'root',
})
export class SegUserService {
    private _segUserInterface: SegUserInterface;

    constructor(private _segUserFactory : SegUserFactory){ 
        this._segUserInterface = this._segUserFactory.injectRepository(); //Inyección del Factory
    }

    getByPagination(userName: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<SegUserEntity>> {
        return this._segUserInterface.getByPagination(userName, pageIndex, pageSize);
    }

    create(object: SegUserEntity): Observable<ResponseEntity<number>> {
        return this._segUserInterface.create(object);
    }

    update(object: SegUserEntity): Observable<ResponseEntity<boolean>> {
        return this._segUserInterface.update(object);
    }

    updatePassword(object: SegUserChangePasswordEntity): Observable<ResponseEntity<boolean>> {
        return this._segUserInterface.updatePassword(object);
    }
}

import { Injectable } from '@angular/core';
import { SegUserInterface } from '../../application/repositories/seg-user.interface';
import { SegUserFactory } from '../../infrastructure/seg-user.factory';

@Injectable({
    providedIn: 'root',
})
export class SegUserService {
    private _segUserInterface: SegUserInterface;

    constructor(private _segUserFactory : SegUserFactory){ 
        this._segUserInterface = this._segUserFactory.injectRepository(); //Inyección del Factory
    }

    getByPagination(userName: string, pageIndex: number, pageSize: number) {
        return this._segUserInterface.getByPagination(userName, pageIndex, pageSize);
    }
}

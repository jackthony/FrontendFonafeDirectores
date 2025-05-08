import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ResponseModel } from '../models/IResponseModel';
import { environment } from 'environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';
import { Constant } from '@models/business/constant.interface';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';

@Injectable({
    providedIn: 'root',
})
export class ConstantService extends HttpGenericService<Constant> {

	constructor() {
        super(`${environment.apiUrlBase}/Constante`);
    }

    getAll(nConCodigo: number): Observable<ResponseModel<Constant>> {
        const reqOpt = new RequestOption();
        reqOpt.pathVariables = [nConCodigo];
        return this.getByPagination(reqOpt).pipe(
            map((element: ResponseModel<Constant>) => {
                element.lstItem = element.lstItem.filter(cod => cod.nConValor != 0);
                return element;
            })
        );
    }
}

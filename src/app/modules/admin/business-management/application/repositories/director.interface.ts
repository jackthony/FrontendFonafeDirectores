import { Observable } from "rxjs";
import { BusinessEntity } from "../../domain/entities/business.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";
import { DirectorEntity } from "../../domain/entities/director.entity";

export interface DirectorInterface {
    getByPagination(nIdEmpresa: number, pageIndex: number, pageSize: number): Observable<ResponseEntity<DirectorEntity>>;
    create(object: DirectorEntity): Observable<ResponseEntity<number>>;
    update(object: DirectorEntity): Observable<ResponseEntity<boolean>>;
}

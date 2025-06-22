import { Observable } from "rxjs";
import { ResponseEntity } from "../../domain/entities/response.entity";
import { RoleEntity } from "../../domain/entities/role.entity";

export interface RoleInterface {
    getAll(): Observable<ResponseEntity<RoleEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<RoleEntity>>;
    create(object: RoleEntity): Observable<ResponseEntity<number>>;
    update(object: RoleEntity): Observable<ResponseEntity<boolean>>;
    delete(nId: number): Observable<ResponseEntity<boolean>>;
}

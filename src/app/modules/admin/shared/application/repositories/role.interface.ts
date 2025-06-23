import { Observable } from "rxjs";
import { ResponseEntity } from "../../domain/entities/response.entity";
import { RoleEntity } from "../../domain/entities/role.entity";

export interface RoleInterface {
    getAll(): Observable<ResponseEntity<RoleEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<RoleEntity>>;
    create(object: RoleEntity): Observable<ResponseEntity<number>>;
    update(object: RoleEntity): Observable<ResponseEntity<boolean>>;
    delete(object: RoleEntity): Observable<ResponseEntity<boolean>>;
}

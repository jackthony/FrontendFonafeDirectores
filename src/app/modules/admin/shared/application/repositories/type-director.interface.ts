import { Observable } from "rxjs";
import { ResponseEntity } from "../../domain/entities/response.entity";
import { TypeDirectorEntity } from "../../domain/entities/type-director.entity";

export interface TypeDirectorInterface {
    getAll(): Observable<ResponseEntity<TypeDirectorEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<TypeDirectorEntity>>;
    create(object: TypeDirectorEntity): Observable<ResponseEntity<number>>;
    update(object: TypeDirectorEntity): Observable<ResponseEntity<boolean>>;
    delete(nId: number): Observable<ResponseEntity<boolean>>;
}

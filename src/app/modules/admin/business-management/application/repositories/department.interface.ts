import { Observable } from "rxjs";
import { ResponseEntity } from "../../domain/entities/response.entity";
import { DepartmentEntity } from "../../domain/entities/departament.entity";

export interface DepartmentInterface {
    getByPagination(): Observable<ResponseEntity<DepartmentEntity>>;
}

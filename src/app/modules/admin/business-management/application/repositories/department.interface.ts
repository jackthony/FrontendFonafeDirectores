import { Observable } from "rxjs";
import { DepartmentEntity } from "../../domain/entities/departament.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";

export interface DepartmentInterface {
    getByPagination(): Observable<ResponseEntity<DepartmentEntity>>;
}

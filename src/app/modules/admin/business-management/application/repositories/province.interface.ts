import { Observable } from "rxjs";
import { ProvinceEntity } from "../../domain/entities/province.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";

export interface ProvinceInterface {
    getByPagination(sIdDepartamento: string): Observable<ResponseEntity<ProvinceEntity>>;
}

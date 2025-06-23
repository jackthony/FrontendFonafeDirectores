import { Observable } from "rxjs";
import { SegUserEntity } from "../../domain/entities/seg-user.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";
import { SegUserChangePasswordEntity } from "../../domain/entities/seg-user-change-password.entity";
import { SegUserChangePassForceEntity } from "../../domain/entities/seg-user-change-pass-force.entity";

export interface SegUserInterface {
    getByPagination(userName: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<SegUserEntity>>;
    create(object: SegUserEntity): Observable<ResponseEntity<number>>;
    update(object: SegUserEntity): Observable<ResponseEntity<boolean>>;
    updatePassword(object: SegUserChangePasswordEntity): Observable<ResponseEntity<boolean>>;
    updateForcePassword(object: SegUserChangePassForceEntity): Observable<ResponseEntity<boolean>>;
}

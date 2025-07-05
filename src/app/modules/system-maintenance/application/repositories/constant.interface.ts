/*******************************************************************************************************
 * Nombre de interfaz:    ConstantInterface
 * Descripción:           Define la operación para obtener constantes a partir de un código específico.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { ConstantEntity } from "../../domain/entities/constant.entity";
import { ResponseEntity } from "@models/response.entity";
export interface ConstantInterface {
    getAll(code: number): Observable<ResponseEntity<ConstantEntity>>;
}

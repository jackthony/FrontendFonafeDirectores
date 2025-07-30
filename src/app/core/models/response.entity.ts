/*******************************************************************************************************
 * Nombre de interfaz:    ResponseEntity<T>
 * Descripción:           Estructura estándar de respuesta para operaciones HTTP, incluye información 
 *                        de auditoría, resultado, errores, paginación y datos (único o lista).
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { Pagination } from "./pagination.entity";
/**
 * Representa una respuesta estándar de la API para cualquier operación.
 * @template T Tipo de dato que se retorna (entidad, DTO, etc.).
 */
export interface ResponseEntity<T> {
    clientName: string;
    isSuccess: boolean;
    lstError: string[];
    lstItem: T[];
    pagination?: Pagination;
    resultado: number;
    serverName: string;
    ticket: string;
    userName: string;
    item: T;
}
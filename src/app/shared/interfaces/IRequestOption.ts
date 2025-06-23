/*******************************************************************************************************
 * Nombre del archivo:  request-option.model.ts
 * Descripción:          Modelo que encapsula la configuración para realizar una solicitud HTTP.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Inclusión de tipos seguros `MethodHttp` y `ResponseType`
 *                       - Incorporación de `pathVariables` y `queryParams`
 *******************************************************************************************************/
/**
 * Clase que representa las opciones necesarias para construir una solicitud HTTP dinámica.
 * Permite definir la URL base, el recurso, el método HTTP, el cuerpo de la solicitud, los
 * parámetros de ruta (`pathVariables`), los parámetros de consulta (`queryParams`) y otras
 * opciones como tipo de respuesta o uso de cargador visual (`loader`).
 */
export class RequestOption {
    url: string;
    resource: string;
    request: any;
    type: ResponseType = 'JSON';
    json: boolean = true;
    method: MethodHttp;
    excludeLoader: string = '0';
    pathVariables: (string | number)[] = [];
    queryParams: QueryParamsApi[] = [];
    constructor(init?: Partial<RequestOption>) {
        if (init) {
          Object.assign(this, init);
        }
    }
}
/**
 * Interfaz que representa un parámetro de consulta (`query string`).
 * Usado en `RequestOption.queryParams`.
 */
export interface QueryParamsApi {
    key: string; 
    value: string | number
}
/**
 * Tipos válidos de métodos HTTP soportados por `RequestOption`.
 */
type MethodHttp = "GET" | "POST" | "PUT" | "DELETE";
/**
 * Tipos válidos de respuesta esperada en la solicitud.
 */
type ResponseType = 'JSON' | 'BLOB';
/*******************************************************************************************************
 * Nombre del archivo:  request-option.model.ts
 * Descripción:          Modelo que encapsula la configuración para realizar una solicitud HTTP.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Inclusión de tipos seguros `MethodHttp` y `ResponseType`
 *                       - Incorporación de `pathVariables` y `queryParams`
 *******************************************************************************************************/
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
export interface QueryParamsApi {
    key: string; 
    value: string | number
}
type MethodHttp = "GET" | "POST" | "PUT" | "DELETE";
type ResponseType = 'JSON' | 'BLOB';
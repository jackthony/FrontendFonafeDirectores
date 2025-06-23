/*******************************************************************************************************
 * Nombre del archivo:  http-generic.service.ts
 * Descripción:          Servicio genérico para facilitar operaciones CRUD sobre una URL base.
 *                      Permite realizar solicitudes GET, POST y POST simulando PUT/DELETE, 
 *                      encapsulando el uso de HttpRequestService con RequestOption.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Integración con HttpRequestService.
 *                       - Abstracción de operaciones CRUD sobre rutas genéricas.
 *                       - Compatibilidad con recursos RESTful.
 *******************************************************************************************************/
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequestService } from './http-request.service';
import { RequestOption } from '../interfaces/IRequestOption';
import { ResponseModel } from '@models/IResponseModel';
@Injectable({
  providedIn: 'root'
})
export class HttpGenericService<T> {
  protected _httpRequest = inject(HttpRequestService);
  constructor(private _url: string = "") { }
  /**
   * Realiza una solicitud GET para obtener datos con paginación.
   * @param request La solicitud con los parámetros de consulta.
   * @returns Un Observable con la respuesta del servidor.
   */
  getByPagination(request: RequestOption): Observable<ResponseModel<T>> {
    request.url = ` ${this._url}/GetByPagination`;
    request.method = "GET";
    return this._httpRequest.callHttpParameters(request);
  }
  /**
   * Realiza una solicitud GET para obtener un recurso específico.
   * @param request La solicitud con los parámetros de consulta.
   * @returns Un Observable con la respuesta del servidor.
   */
  get(request: RequestOption): Observable<ResponseModel<T> | Blob> {
    request.url = `${this._url}/${request.resource ?? ''}`;
    request.method = "GET";
    return this._httpRequest.callHttpParameters(request);
  }
  /**
   * Realiza una solicitud POST para crear un nuevo recurso.
   * @param request La solicitud con los datos para crear el recurso.
   * @returns Un Observable con la respuesta del servidor.
   */
  create(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = "POST";
    request.url = `${this._url}/${request.resource ?? 'Insert'}`;
    return this._httpRequest.http(request);
  }
  /**
   * Realiza una solicitud POST para actualizar un recurso existente.
   * @param request La solicitud con los datos para actualizar el recurso.
   * @returns Un Observable con la respuesta del servidor.
   */
  update(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = "POST";
    request.url = `${this._url}/${request.resource ?? 'Update'}`;
    return this._httpRequest.http(request);
  }
  /**
   * Realiza una solicitud POST para eliminar un recurso existente.
   * @param request La solicitud con los datos para eliminar el recurso.
   * @returns Un Observable con la respuesta del servidor.
   */
  delete(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = "POST";
    request.url = `${this._url}/${request.resource ?? 'Delete'}`;
    return this._httpRequest.callHttpParameters(request);
  }
  /**
   * Realiza una solicitud POST para enviar datos a un recurso específico.
   * @param request La solicitud con los datos para el recurso.
   * @returns Un Observable con la respuesta del servidor.
   */
  post(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = "POST";
    request.url = `${this._url}/${request.resource}`;
    return this._httpRequest.callHttpParameters(request);
  }
}
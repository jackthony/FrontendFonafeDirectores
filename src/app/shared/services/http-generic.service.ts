import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequestService } from './http-request.service';
import { RequestOption } from '../interfaces/IRequestOption';
import { ResponseModel } from '@models/IResponseModel';

@Injectable({
  providedIn: 'root'
})
export class HttpGenericService<T> {

  // Inyecta el servicio HttpRequestService para realizar las solicitudes HTTP
  protected _httpRequest = inject(HttpRequestService);

  // Constructor que recibe una URL base opcional, que se puede pasar al crear una instancia del servicio
  constructor(private _url: string = "") { }

  /**
   * Realiza una solicitud GET para obtener datos con paginación.
   * @param request La solicitud con los parámetros de consulta.
   * @returns Un Observable con la respuesta del servidor.
   */
  getByPagination(request: RequestOption): Observable<ResponseModel<T>> {
    request.url = ` ${this._url}/GetByPagination`; // Establece la URL para la solicitud de paginación
    request.method = "GET"; // Establece el método HTTP como GET

    return this._httpRequest.callHttpParameters(request); // Llama al servicio HttpRequestService para hacer la solicitud
  }

  /**
   * Realiza una solicitud GET para obtener un recurso específico.
   * @param request La solicitud con los parámetros de consulta.
   * @returns Un Observable con la respuesta del servidor.
   */
  get(request: RequestOption): Observable<ResponseModel<T> | Blob> {
    request.url = `${this._url}/${request.resource ?? ''}`; // Establece la URL de la solicitud, utilizando el recurso si está presente
    request.method = "GET"; // Establece el método HTTP como GET

    return this._httpRequest.callHttpParameters(request); // Llama al servicio HttpRequestService para hacer la solicitud
  }

  /**
   * Realiza una solicitud POST para crear un nuevo recurso.
   * @param request La solicitud con los datos para crear el recurso.
   * @returns Un Observable con la respuesta del servidor.
   */
  create(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = "POST"; // Establece el método HTTP como POST
    request.url = `${this._url}/${request.resource ?? 'Insert'}`; // Establece la URL para la creación de un recurso

    return this._httpRequest.http(request); // Llama al servicio HttpRequestService para hacer la solicitud
  }

  /**
   * Realiza una solicitud POST para actualizar un recurso existente.
   * @param request La solicitud con los datos para actualizar el recurso.
   * @returns Un Observable con la respuesta del servidor.
   */
  update(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = "POST"; // Establece el método HTTP como POST
    request.url = `${this._url}/${request.resource ?? 'Update'}`; // Establece la URL para la actualización de un recurso

    return this._httpRequest.http(request); // Llama al servicio HttpRequestService para hacer la solicitud
  }

  /**
   * Realiza una solicitud POST para eliminar un recurso existente.
   * @param request La solicitud con los datos para eliminar el recurso.
   * @returns Un Observable con la respuesta del servidor.
   */
  delete(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = "POST"; // Establece el método HTTP como POST
    request.url = `${this._url}/${request.resource ?? 'Delete'}`; // Establece la URL para la eliminación de un recurso

    return this._httpRequest.callHttpParameters(request); // Llama al servicio HttpRequestService para hacer la solicitud
  }

  /**
   * Realiza una solicitud POST para enviar datos a un recurso específico.
   * @param request La solicitud con los datos para el recurso.
   * @returns Un Observable con la respuesta del servidor.
   */
  post(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = "POST"; // Establece el método HTTP como POST
    request.url = `${this._url}/${request.resource}`; // Establece la URL para la solicitud POST

    return this._httpRequest.callHttpParameters(request); // Llama al servicio HttpRequestService para hacer la solicitud
  }
}

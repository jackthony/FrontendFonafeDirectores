/*******************************************************************************************************
 * Nombre del archivo:  file-component-state.service.ts
 * Descripción:          Servicio encargado de gestionar el estado del componente relacionado con los archivos.
 *                       Utiliza un BehaviorSubject para almacenar y emitir el estado de la UI del componente 
 *                       de archivos. Permite modificar y observar el estado del componente, como el título, 
 *                       si está habilitado o no, y el mensaje de error asociado.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial para gestionar el estado del componente de archivos.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { FileComponentState } from 'app/shared/interfaces/file-component-state.interface';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class FileComponentStateService {
    private uiStateSubject = new BehaviorSubject<FileComponentState>({
        title: '',
        isDisabled: true,
        message: '* No tiene acceso al repositorio de documentos',
        root: '',
    });
    fileComponentState$: Observable<FileComponentState> = this.uiStateSubject.asObservable();
    setFileComponentState(state: FileComponentState) {
        this.uiStateSubject.next(state);
    }
}
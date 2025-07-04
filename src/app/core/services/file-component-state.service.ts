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

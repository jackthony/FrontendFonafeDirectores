import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';

@Injectable({
    providedIn: 'root',
})
export class ArchivingProcessService<T> extends HttpGenericService<T> {
    constructor() {
        super(`${environment.apiUrlBase}/ArchivoProceso`);
    }

    uploadFile(): Promise<File> {
        return new Promise((resolve, reject) => {
            try {
                const inputFile = document.createElement('input');
                inputFile.type = 'file';
                inputFile.accept = '*/*'; 
                inputFile.style.display = 'none';
    
                inputFile.addEventListener('change', async (event: Event) => {
                    try {
                        const target = event.target as HTMLInputElement;
                        const files = target.files as FileList;
                        //const uploadFile = await this.selectedFiles(event); 
                        if (files) 
                            resolve(files[0]); 
                        else 
                            resolve(null);
                    } catch (error) {
                        reject(error); 
                    } finally {
                        document.body.removeChild(inputFile);
                    }
                });
                document.body.appendChild(inputFile);
                inputFile.click();
            } catch (error) {
                reject(error);
            }
        });
        
    }
}

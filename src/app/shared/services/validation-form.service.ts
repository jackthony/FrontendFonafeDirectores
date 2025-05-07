import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ValidationFormService {
    constructor() {}

    validarRuc(control: AbstractControl): ValidationErrors | null {
        const ruc = control.value;
        if (!ruc) return null;

        if (ruc.length !== 11 || isNaN(Number(ruc)) || /[^0-9]/.test(ruc)) {
            return { customError: 'Debe tener 11 dígitos numéricos' };
        }

        const tipoContribuyente = ruc.substring(0, 2);
        const tiposPermitidos = ['10', '20'];
        if (!tiposPermitidos.includes(tipoContribuyente)) {
            return { customError: 'Tipo de contribuyente inválido' };
        }

        return null;
    }

    validationDocument(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;
        const regex = /^\d{8,9}[A-Za-z]?$/;
        if (!regex.test(value)) {
          return { customError: 'Documento inválido' };
        }
        return null;
    }

    validationPhone(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;
        const cleanedValue = value.replace(/\s/g, '');

        if (cleanedValue.length !== 7 && cleanedValue.length !== 9) {
          return { customError: 'Teléfono inválido' };
        }
    
        if (!/^\d+$/.test(cleanedValue)) {
          return { customError: 'Teléfono inválido' };
        }
    
        return null;
    }

    validationMail(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        if (!value) {
            return null;
        }
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if(!emailRegex.test(control.value)){
            return { customError: 'Correo inválido' };
        }
    
        return null;
    }
}

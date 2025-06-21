import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
@Injectable({
    providedIn: 'root',
})
export class ValidationFormService {
    constructor() {}
    /**
     * Valida el RUC (Registro Único de Contribuyentes) de un usuario.
     * @param control El control del formulario que contiene el RUC
     * @returns Un objeto de error si el RUC no es válido, o null si es válido
     */
    validarRuc(control: AbstractControl): ValidationErrors | null {
        const ruc = control.value;
        if (!ruc) return null;
        if (ruc.length !== 11 || isNaN(Number(ruc)) || /[^0-9]/.test(ruc)) {
            return { customError: 'Debe tener 11 dígitos numéricos' };
        }
        const tipoContribuyente = ruc.substring(0, 2);
        const tiposPermitidos = ['20'];
        if (!tiposPermitidos.includes(tipoContribuyente)) {
            return { customError: 'Tipo de contribuyente inválido' };
        }
        return null;
    }
    /**
     * Valida un número de documento de identidad (DNI).
     * @param control El control del formulario que contiene el documento
     * @returns Un objeto de error si el documento no es válido, o null si es válido
     */
    validationDocument(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;
        const regex = /^\d{8,9}[A-Za-z]?$/;
        if (!regex.test(value)) {
            return { customError: 'Documento inválido' };
        }
        return null;
    }
    /**
     * Valida una contraseña detallada.
     * @param control El control del formulario que contiene la contraseña
     * @returns Un objeto de error si la contraseña no cumple con los requisitos, o null si es válida
     */
    passwordDetailedValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;
        if (!/[A-Z]/.test(value)) {
            return {
                customError: 'Debe contener al menos una letra mayúscula.',
            };
        }
        if (!/\d/.test(value)) {
            return { customError: 'Debe contener al menos un número.' };
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return {
                customError: 'Debe contener al menos un carácter especial.',
            };
        }
        if (value.length < 7) {
            return {
                customError: 'La contraseña debe tener mínimo 7 caracteres.',
            };
        }
        return null;
    }
    /**
     * Valida un número de teléfono.
     * @param control El control del formulario que contiene el número de teléfono
     * @returns Un objeto de error si el teléfono no es válido, o null si es válido
     */
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
    /**
     * Valida una dirección de correo electrónico.
     * @param control El control del formulario que contiene el correo
     * @returns Un objeto de error si el correo no es válido, o null si es válido
     */
    validationMail(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) {
            return null;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(control.value)) {
            return { customError: 'Correo inválido' };
        }
        return null;
    }
    /**
     * Valida una fecha en formato dd/MM/yyyy.
     * @param control El control del formulario que contiene la fecha
     * @returns Un objeto de error si la fecha no es válida, o null si es válida
     */
    validationDate(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;
        const datePattern = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
        if (!datePattern.test(value)) {
            return { customError: 'El formato debe ser dd/MM/yyyy.' };
        }
        const [day, month, year] = value.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return { customError: 'La fecha ingresada no es válida.' };
        }
        return null;
    }
}
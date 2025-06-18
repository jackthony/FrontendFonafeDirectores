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
        if (!ruc) return null; // Si no hay valor, no hay error

        // Verifica si el RUC tiene 11 dígitos y si es numérico
        if (ruc.length !== 11 || isNaN(Number(ruc)) || /[^0-9]/.test(ruc)) {
            return { customError: 'Debe tener 11 dígitos numéricos' }; // Error si el RUC no tiene 11 dígitos o contiene caracteres no numéricos
        }

        const tipoContribuyente = ruc.substring(0, 2); // Obtiene los primeros dos dígitos del RUC para validar el tipo de contribuyente
        const tiposPermitidos = ['20']; // Solo el tipo 20 es válido
        if (!tiposPermitidos.includes(tipoContribuyente)) {
            return { customError: 'Tipo de contribuyente inválido' }; // Error si el tipo de contribuyente no es válido
        }

        return null; // Si todo es correcto, no hay error
    }

    /**
     * Valida un número de documento de identidad (DNI).
     * @param control El control del formulario que contiene el documento
     * @returns Un objeto de error si el documento no es válido, o null si es válido
     */
    validationDocument(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null; // Si no hay valor, no hay error
        const regex = /^\d{8,9}[A-Za-z]?$/; // El documento debe ser de 8 o 9 dígitos y puede tener una letra al final
        if (!regex.test(value)) {
            return { customError: 'Documento inválido' }; // Error si el documento no cumple con el patrón
        }
        return null; // Si todo es correcto, no hay error
    }

    /**
     * Valida una contraseña detallada.
     * @param control El control del formulario que contiene la contraseña
     * @returns Un objeto de error si la contraseña no cumple con los requisitos, o null si es válida
     */
    passwordDetailedValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null; // Si no hay valor, no hay error

        // Verifica que la contraseña contenga al menos una letra mayúscula
        if (!/[A-Z]/.test(value)) {
            return {
                customError: 'Debe contener al menos una letra mayúscula.',
            };
        }

        // Verifica que la contraseña contenga al menos un número
        if (!/\d/.test(value)) {
            return { customError: 'Debe contener al menos un número.' };
        }

        // Verifica que la contraseña contenga al menos un carácter especial
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return {
                customError: 'Debe contener al menos un carácter especial.',
            };
        }

        // Verifica que la contraseña tenga al menos 7 caracteres
        if (value.length < 7) {
            return {
                customError: 'La contraseña debe tener mínimo 7 caracteres.',
            };
        }

        return null; // Si todo es correcto, no hay error
    }

    /**
     * Valida un número de teléfono.
     * @param control El control del formulario que contiene el número de teléfono
     * @returns Un objeto de error si el teléfono no es válido, o null si es válido
     */
    validationPhone(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null; // Si no hay valor, no hay error
        const cleanedValue = value.replace(/\s/g, ''); // Elimina los espacios en blanco

        // Verifica que el número de teléfono tenga 7 o 9 dígitos
        if (cleanedValue.length !== 7 && cleanedValue.length !== 9) {
            return { customError: 'Teléfono inválido' }; // Error si el teléfono no tiene 7 o 9 dígitos
        }

        // Verifica que el número solo contenga dígitos
        if (!/^\d+$/.test(cleanedValue)) {
            return { customError: 'Teléfono inválido' }; // Error si el teléfono contiene caracteres no numéricos
        }

        return null; // Si todo es correcto, no hay error
    }

    /**
     * Valida una dirección de correo electrónico.
     * @param control El control del formulario que contiene el correo
     * @returns Un objeto de error si el correo no es válido, o null si es válido
     */
    validationMail(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        if (!value) {
            return null; // Si no hay valor, no hay error
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para validar correos electrónicos
        if (!emailRegex.test(control.value)) {
            return { customError: 'Correo inválido' }; // Error si el correo no cumple con el patrón
        }

        return null; // Si todo es correcto, no hay error
    }

    /**
     * Valida una fecha en formato dd/MM/yyyy.
     * @param control El control del formulario que contiene la fecha
     * @returns Un objeto de error si la fecha no es válida, o null si es válida
     */
    validationDate(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null; // Si no hay valor, no hay error

        const datePattern = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/; // Expresión regular para validar el formato de fecha dd/MM/yyyy
        if (!datePattern.test(value)) {
            return { customError: 'El formato debe ser dd/MM/yyyy.' }; // Error si la fecha no cumple con el formato
        }

        const [day, month, year] = value.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        // Verifica que la fecha sea válida (por ejemplo, 31/02/2020 no es válida)
        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return { customError: 'La fecha ingresada no es válida.' }; // Error si la fecha no es válida
        }

        return null; // Si todo es correcto, no hay error
    }
}
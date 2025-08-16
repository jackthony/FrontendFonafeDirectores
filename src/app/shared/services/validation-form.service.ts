/*************************************************************************************
 * Nombre del archivo:  validation-form.service.ts
 * Descripción:         Servicio centralizado de validaciones personalizadas para formularios.
 *                      Incluye validación de RUC, DNI, correo, teléfono, fechas y contraseñas
 *                      bajo reglas específicas del dominio de negocio.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 22/06/2025 por Daniel Alva
 * Cambios recientes:   Implementación de validadores reutilizables para formularios reactivos.
 *************************************************************************************/
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
    dniValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;  // Si no hay valor, no se aplica ninguna validación
    
        const dniRegex = /^\d{8}$/;  // Validación para 8 dígitos
    
        if (!dniRegex.test(value)) {
            return { customError: 'Documento inválido.' };
        }
    
        return null;  // Si pasa la validación
    }
    
    // Validador para Carnet de Extranjería (CE) - 9 caracteres (alfanuméricos)
    ceValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;  // Si no hay valor, no se aplica ninguna validación
    
        const ceRegex = /^[A-Za-z0-9]{9}$/;  // Validación para 8 dígitos seguidos de una letra
    
        if (!ceRegex.test(value)) {
            return { customError: 'Documento inválido.' };
        }
    
        return null;  // Si pasa la validación
    }
    /**
     * Valida una contraseña detallada.
     * @param control El control del formulario que contiene la contraseña
     * @returns Un objeto de error si la contraseña no cumple con los requisitos, o null si es válida
     */
    passwordDetailedValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        
        if (!value) return null; // If the value is empty, return no validation errors.

        const trimmedValue = value.trim();

        /* if (value == trimmedValue) {
            return { customError: 'La contraseña no puede tener espacios al inicio o final.' };
        }
 */
        if (value !== trimmedValue) {
            return { customError: 'La contraseña no puede tener espacios al inicio o final.' };
        }
    
        // Minimum length validation
        if (value.length < 8) {
            return { customError: 'La contraseña debe tener mínimo 8 caracteres.' };
        }
    
        // Maximum length validation
        if (value.length > 12) {
            return { customError: 'La contraseña no debe exceder los 12 caracteres.' };
        }
    
        // Lowercase letter validation
        if (!/[a-z]/.test(value)) {
            return { customError: 'Debe contener al menos una letra minúscula.' };
        }
    
        // Uppercase letter validation
        if (!/[A-Z]/.test(value)) {
            return { customError: 'Debe contener al menos una letra mayúscula.' };
        }
    
        // Number validation
        if (!/\d/.test(value)) {
            return { customError: 'Debe contener al menos un número.' };
        }
    
        // Special character validation
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return { customError: 'Debe contener al menos un carácter especial.' };
        }
    
        return null; // If all validations pass, return null indicating no errors.
    }

    spaceValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        
        if (!value) return null;

        const trimmedValue = value.trim();

        if (value !== trimmedValue) {
            return { customError: 'No puede contener espacios al inicio o final' };
        }
    
        return null; // If all validations pass, return null indicating no errors.
    }

    fechasOrdenValidator = (inicio: string, fin: string): ValidatorFn =>
        (group: AbstractControl): ValidationErrors | null => {
          const a = group.get(inicio)?.value;
          const b = group.get(fin)?.value;
          return a && b && b < a ? { customError: 'No puede ser anterior a la fecha de inicio' } : null;
        };

        rangeDateValidator(start: string, end: string): ValidatorFn {
            return (group: AbstractControl) => {
              const startCtrl = group.get(start);
              const endCtrl = group.get(end);
              if (!startCtrl || !endCtrl) return null;
          
              const s = startCtrl.value;
              const e = endCtrl.value;
          
              if (!s || !e) {
                endCtrl.setErrors(null);
                return null;
              }
          
              const invalid = new Date(e) < new Date(s);
              endCtrl.setErrors(invalid ? { customError: 'No puede ser anterior a la fecha de inicio' } : null);
          
              return null;
            };
        }
    /* rangeDateValidator(dateStart: string, dateEnd : string): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const inicioCtrl = group.get(dateStart);
            const finCtrl = group.get(dateEnd);
        
            if (!inicioCtrl || !finCtrl) return null;
        
            const inicio = inicioCtrl.value;
            const fin = finCtrl.value;
        
            if (!inicio || !fin) {
              finCtrl.setErrors(null);
              return null;
            }
        
            const inicioDate = new Date(inicio);
            const finDate = new Date(fin);
        
            if (finDate < inicioDate) {
              finCtrl.setErrors({ customError: 'No puede ser anterior a la fecha de inicio' });
              return { customError: 'No puede ser anterior a la fecha de inicio' };
            } else {
              // 👇 OJO: si tiene otros errores, hay que preservarlos
              if (finCtrl.errors) {
                const { fechaFinMenor, ...rest } = finCtrl.errors;
                finCtrl.setErrors(Object.keys(rest).length ? rest : null);
              } else {
                finCtrl.setErrors(null);
              }
              return null;
            }
          };
      } */

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

    validatePersonalTypeFonafe(control: AbstractControl): ValidationErrors | null {
        const email = control.value;
            const emailPattern = /^[a-zA-Z0-9._%+-]+@fonafe\.gob\.pe$/;
            if (email && !emailPattern.test(email)) {
                return { customError: 'Formato requerido: xxxx@fonafe.gob.pe' };
            }
            return null;
    }

    validatePersonalNotTypeFonafe(control: AbstractControl): ValidationErrors | null {
        const email = control.value;
            const emailPattern = /^[a-zA-Z0-9._%+-]+@fonafe\.gob\.pe$/;
            if (email && emailPattern.test(email)) {
                return { customError: 'Correo no permitido: @fonafe.gob.pe' };
            }
            return null;
    }
}
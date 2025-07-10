/*******************************************************************************************************
 * Nombre del archivo:  password-validation.service.ts
 * Descripción:          Servicio encargado de validar las contraseñas según una serie de criterios predefinidos,
 *                       como longitud mínima y máxima, presencia de minúsculas, mayúsculas, números, y caracteres especiales.
 *                       El servicio devuelve los mensajes de error correspondientes a cada validación fallida.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del servicio de validación de contraseñas.
 *******************************************************************************************************/
import { Injectable } from "@angular/core";
import { ErrorMessagesPassword } from "app/shared/interfaces/error-messages.interface";
@Injectable({
    providedIn: 'root',
})
export class PasswordValidationService {
    private errorMessages: ErrorMessagesPassword[] = [
        { message: 'Requiere al menos 8 caracteres.', valid: true, key: 'minLength' },
        { message: 'Requiere como máximo 12 caracteres.', valid: true, key: 'maxLength' },
        { message: 'Debe incluir una minúscula.', valid: true, key: 'lowercase' },
        { message: 'Debe incluir una mayúscula.', valid: true, key: 'uppercase' },
        { message: 'Debe incluir un número.', valid: true, key: 'number' },
        { message: 'Debe incluir un carácter especial.', valid: true, key: 'specialChar' },
    ];
      validatePassword(password: string): ErrorMessagesPassword[] {
        const validations = {
          minLength: password?.length >= 8,
          maxLength: password?.length >= 8 && password?.length <= 12,
          lowercase: /[a-z]/.test(password),
          uppercase: /[A-Z]/.test(password),
          number: /[0-9]/.test(password),
          specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
        Object.keys(validations).forEach((key) => {
          const valid = validations[key];
          this.updateErrorMessage(key, valid);
        });
        return this.errorMessages;
      }
      private updateErrorMessage(key: string, valid: boolean): void {
        const error = this.errorMessages.find((e) => e.key === key);
        if (error) {
          error.valid = !valid;
        }
      }
    getInvalidErrors(): string[] {
        return this.errorMessages.filter((error) => !error.valid).map((error) => error.message);
    }
    getDefaultErrors(): ErrorMessagesPassword[] {
        return [...this.errorMessages];
    }
}
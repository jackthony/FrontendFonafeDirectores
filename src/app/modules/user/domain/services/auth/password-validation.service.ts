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
        { message: 'No debe incluir espacios al inicio y/o final', valid: true, key: 'spacesTrim' },
        { message: 'Requiere al menos 8 caracteres.', valid: true, key: 'minLength' },
        { message: 'Requiere como máximo 12 caracteres.', valid: true, key: 'maxLength' },
        { message: 'Debe incluir una minúscula.', valid: true, key: 'lowercase' },
        { message: 'Debe incluir una mayúscula.', valid: true, key: 'uppercase' },
        { message: 'Debe incluir un número.', valid: true, key: 'number' },
        { message: 'Debe incluir un carácter especial.', valid: true, key: 'specialChar' },
    ];
    validatePassword(password: string): ErrorMessagesPassword[] {
      const validations = {
          spacesTrim: !/^\s|\s$/.test(password), // Validación para no permitir espacios al inicio o al final
          minLength: password?.length >= 8,
          maxLength: password?.length <= 12,
          lowercase: /[a-z]/.test(password),
          uppercase: /[A-Z]/.test(password),
          number: /[0-9]/.test(password),
          specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      };
  
      // Creamos una copia de errorMessages y actualizamos la propiedad "valid"
      const updatedErrorMessages = this.errorMessages.map((errorMessage) => {
          const valid = validations[errorMessage.key]; // Verificamos la validación correspondiente
          return { ...errorMessage, valid: !valid }; // Retornamos una nueva instancia con la propiedad "valid" actualizada
      });
  
      return updatedErrorMessages;
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
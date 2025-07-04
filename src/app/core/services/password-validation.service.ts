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
    
    
      // Validar contraseña
      validatePassword(password: string): ErrorMessagesPassword[] {
        const validations = {
          minLength: password?.length >= 8,
          maxLength: password?.length >= 8 && password?.length <= 12,
          lowercase: /[a-z]/.test(password),
          uppercase: /[A-Z]/.test(password),
          number: /[0-9]/.test(password),
          specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
    
        // Actualizamos el estado de validación de cada error
        Object.keys(validations).forEach((key) => {
          const valid = validations[key];
          this.updateErrorMessage(key, valid);
        });
    
        // Retornar los errores
        return this.errorMessages;
      }
    
      // Actualizar el estado de validez de los mensajes de error
      private updateErrorMessage(key: string, valid: boolean): void {
        const error = this.errorMessages.find((e) => e.key === key);
        if (error) {
          error.valid = !valid;  // Si es 'true', la regla está violada, por lo que 'valid' debe ser 'false'
        }
      }
    
      // Solo retornar los errores no válidos (puedes llamar a esto cuando necesites los mensajes para mostrar)
    getInvalidErrors(): string[] {
        return this.errorMessages.filter((error) => !error.valid).map((error) => error.message);
    }

    getDefaultErrors(): ErrorMessagesPassword[] {
        return [...this.errorMessages];
    }
}
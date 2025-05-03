import { Pipe, PipeTransform, inject } from "@angular/core";
import { AbstractControl } from "@angular/forms";
@Pipe({
    name: "translateMessageForm",
    standalone: true,
    pure: false
})
export class TranslateMessageForm implements PipeTransform {
    transform(value: AbstractControl, type?: string): string {
        if (!value || !value.errors) return "";
        const error = this.getErrorControl(value, type);
        return error;
    }

    private getErrorControl(control: AbstractControl, type?: string): string {
        if (control.hasError("required")) return "El campo es requerido";
        if (control.hasError("min")) {
            if (type === "select") return 'Seleccione una opción';
            return `Valor mínimo: ${control.errors?.min?.min}`;
        }
        if (control.hasError("max")) return `Valor máximo ${control.errors?.max?.max}`;
        if (control.hasError("minlength")) return `Mínimo ${control.errors.minlength.requiredLength} caracteres`;
        if (control.hasError("maxlength")) return `Máximo ${control.errors.maxlength.requiredLength} caracteres`;
        if (control.hasError("matStartDateInvalid")) return "Fecha inicial fuera de rango";
        if (control.hasError("matEndDateInvalid")) return "Fecha final fuera de rango";
        if (control.hasError("matDatepickerParse")) return "Formato de fecha incorrecta";
        if (control.hasError("customError")) return `${control.errors.customError}`;
        if (control.hasError("pattern")) return "El formato no es válido";
        return 'Campo inválido';
    }
}

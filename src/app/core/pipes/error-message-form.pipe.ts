import { DatePipe } from "@angular/common";
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
        if (control.hasError("matDatepickerParse")) {
            const dateText = control.errors.matDatepickerParse.text as string
            if(dateText.length === 10) {
                const [dayStr, monthStr, yearStr] = dateText.split('/');
                const day = Number(dayStr);
                const month = Number(monthStr);
                const year = Number(yearStr);
              
                if (month < 1 || month > 12) {/*  */
                  return 'El mes debe estar entre 1 y 12.' ;
                }
              
                const daysInMonth = new Date(year, month, 0).getDate();
              
                if (day < 1 || day > daysInMonth) {
                  return `El día debe estar entre 1 y ${daysInMonth}`;
                }
            }
            return "Formato requerido: dd/mm/yyyy";
        } 
        if (control.hasError("customError")) return `${control.errors.customError}`;
        if (control.hasError("required")){
            if (type === "date") return 'Formato requerido: dd/mm/yyyy';
            return "El campo es requerido";
        } 
        if (control.hasError("min")) {
            if (type === "select") return 'Seleccione una opción';
            return `Número mínimo: ${control.errors?.min?.min}`;
        }
        if (control.hasError("max")) return `Número máximo: ${control.errors?.max?.max}`;
        if (control.hasError("minlength")) return `Mínimo ${control.errors.minlength.requiredLength} caracteres`;
        if (control.hasError("maxlength")) return `Máximo ${control.errors.maxlength.requiredLength} caracteres`;
        if (control.hasError("matStartDateInvalid")) return "Fecha inicial fuera de rango";
        if (control.hasError("matEndDateInvalid")) return "Fecha final fuera de rango";
        if (control.hasError("pattern")) return "El formato no es válido";
        if (control.hasError("matDatepickerMax")) {
            const date = control.errors.matDatepickerMax.max;
            const formattedDate = date.toFormat('dd/MM/yyyy')
            return `Máxima fecha: ${formattedDate} `;
        } 
        return 'Campo inválido';
    }
}

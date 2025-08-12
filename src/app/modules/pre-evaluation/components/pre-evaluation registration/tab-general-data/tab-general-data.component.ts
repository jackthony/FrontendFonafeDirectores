import { Component, input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GeneralButtonEnum } from 'app/shared/enums/general-button.enum';

@Component({
    selector: 'app-tab-general-data',
    standalone: false,
    templateUrl: './tab-general-data.component.html',
    styleUrl: './tab-general-data.component.scss',
})
export class TabGeneralDataComponent {
    maxDate: Date;
    form: FormGroup;
    minDate: Date;
    textBtnSearch = input<string>('Agregar usuario');
    iconBtnSearch = input<string>('mat_outline:add_circle_outline');
	btnInverter = signal<number>(GeneralButtonEnum.INVERTER);
    searchuser(): void {}

    onKeyPressDate(event: KeyboardEvent) {
        const allowedRegex = /[0-9\/]/;
        if (!allowedRegex.test(event.key)) {
            event.preventDefault();
        }
    }
    onInputDate(event: Event, nameForm: string) {
        const input = event.target as HTMLInputElement;
        const validPattern = /^[0-9\/]*$/;
        if (!validPattern.test(input.value)) {
            const cleaned = input.value.replace(/[^0-9\/]/g, '');
            input.value = cleaned;
            this.form.get(nameForm)?.setValue(cleaned, { emitEvent: false });
        }
    }
}

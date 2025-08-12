import {
    Component,
    EventEmitter,
    inject,
    input,
    OnInit,
    Output,
    signal,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DirectorEntity } from 'app/modules/business/domain/entities/business/director.entity';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { GeneralButtonEnum } from 'app/shared/enums/general-button.enum';

@Component({
    selector: 'app-home-pre-evaluation',
    standalone: false,
    templateUrl: './home-pre-evaluation.component.html',
    styleUrl: './home-pre-evaluation.component.scss',
})
export class HomePreEvaluationComponent implements OnInit {
    private readonly _router = inject(Router);
    private _fb = inject(FormBuilder);
    maxDate: Date;
    form: FormGroup;
    minDate: Date;
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
    iconBtnSearch = input<string>('mat_outline:add_circle_outline');
    iconBtnCancel = input<string>('mat_outline:cancel');
    iconBtnChecked = input<string>('mat_outline:check_circle');
    director = input.required<DirectorEntity>();
    btnInverter = signal<number>(GeneralButtonEnum.INVERTER);
    btnSuccess = signal<number>(GeneralButtonEnum.GREY);

    @Output() eventNewElement: EventEmitter<void> = new EventEmitter<void>();
    @Output() eventSearch: EventEmitter<string> = new EventEmitter<string>();

    ngOnInit(): void {}

    returnInit(): void {
        this._router.navigate(['home']);
    }

    searchuser(): void {
        this._router.navigate(['solicitudes/home-pre-evaluation']);
    }

    cancelDirectory(): void {}

    registerForm(): void {}
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

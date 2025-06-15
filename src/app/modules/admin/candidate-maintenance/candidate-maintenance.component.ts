import { booleanAttribute, Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Business } from '@models/business/business.interface';
import { Constant } from '@models/business/constant.interface';
import { Ministry } from '@models/business/ministry.interface';
import { SegUser } from '@models/seg-users/seg-user.interface';
import { COLUMNS_PROFILE_MANAGEMENT } from 'app/shared/configs/profile-management/profile-management.config';
import { CANDIDATE_MAINTENANCE_IMPORTS } from 'app/shared/imports/business-management/candidate-maintenance.import';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { ValidationFormService } from 'app/shared/services/validation-form.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-candidate-maintenance',
  standalone: true,
  imports: [...CANDIDATE_MAINTENANCE_IMPORTS],
  templateUrl: './candidate-maintenance.component.html',
  styleUrl: './candidate-maintenance.component.scss'
})
export class CandidateMaintenanceComponent {

  private readonly _router = inject(Router);

  private _fb = inject(FormBuilder);
  private _validationFormService = inject(ValidationFormService);

  textBtnSearch = input<string>('Buscar');
  iconBtnSearch = input<string>('mat_outline:search');
  disableDirective = input(false, { transform: booleanAttribute });
  loadingTable = signal<boolean>(false);
  pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
  headerTable = signal<TableColumnsDefInterface[]>([]);
  dataTableActivities = signal<SegUser[]>([]);
  iconsTable = signal<IconOption<SegUser>[]>([]);
  lstTypedocument = input<Constant[]>([]);
  
  ministries = signal<Ministry[]>([]);
  form: FormGroup;

  @Output() eventNewElement: EventEmitter<void> = new EventEmitter<void>()
    @Output() eventSearch: EventEmitter<string> =
          new EventEmitter<string>();

ngOnInit(): void {
  this.initForm(); // inicializa los controles
  this.headerTable.set(COLUMNS_PROFILE_MANAGEMENT);
  this.valueChangesForm(); // activa las reacciones
}

valueChangesForm(): void {
  const tipoDocControl = this.form.get('nTipoDocumento');
  const numDocControl = this.form.get('sNumeroDocumento');

  // Estado inicial
  if (!tipoDocControl?.value) {
    numDocControl?.disable();
  }

  // Reactividad
  tipoDocControl?.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe((value) => {
      if (value) {
        numDocControl?.enable();
      } else {
        numDocControl?.reset();
        numDocControl?.disable();
      }
      numDocControl?.markAsUntouched();
    });
}
searchuser(): void {
  if (this.form?.valid) {
    this.eventSearch.emit(this.form.value.sNumeroDocumento);
  } else {
    this.form.markAllAsTouched();
  }
}


initForm(data?: Partial<{ nTipoDocumento: number; sNumeroDocumento: string; sApellidosNombres: string }>): void {
  this.form = this._fb.group({
    nTipoDocumento: [data?.nTipoDocumento ?? null, Validators.required],
    sNumeroDocumento: [data?.sNumeroDocumento ?? '', [Validators.required, Validators.maxLength(9)]],
    sApellidosNombres: [data?.sApellidosNombres ?? '', Validators.required],
  });
}


  returnInit(): void {
    this._router.navigate(['home']);
  }

  
  onKeyPress(event: KeyboardEvent) {
    const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
    if (!allowedRegex.test(event.key)) {
      event.preventDefault();
    }
  }
	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchuser();
	}
  onInput(event: Event, nameForm: string) {
    const input = event.target as HTMLInputElement;
    const validPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;

    if (!validPattern.test(input.value)) {
      const cleaned = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      input.value = cleaned;
      this.form.get(nameForm).setValue(cleaned, { emitEvent: false });
    }
  }
}

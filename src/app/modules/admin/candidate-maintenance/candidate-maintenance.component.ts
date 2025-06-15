import { booleanAttribute, Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SegUser } from '@models/seg-users/seg-user.interface';
import { Ministry } from '@models/system-maintenance/ministry.interface';
import { COLUMNS_PROFILE_MANAGEMENT } from 'app/shared/configs/profile-management/profile-management.config';
import { CANDIDATE_MAINTENANCE_IMPORTS } from 'app/shared/imports/business-management/candidate-maintenance.import';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { ValidationFormService } from 'app/shared/services/validation-form.service';

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

  textBtnSearch = input<string>('Agregar usuario');
  iconBtnSearch = input<string>('mat_outline:add_circle_outline');
  disableDirective = input(false, { transform: booleanAttribute });
  loadingTable = signal<boolean>(false);
  pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
  headerTable = signal<TableColumnsDefInterface[]>([]);
  dataTableActivities = signal<SegUser[]>([]);
  iconsTable = signal<IconOption<SegUser>[]>([]);

  ministries = signal<Ministry[]>([]);
  form: FormGroup;

  @Output() eventNewElement: EventEmitter<void> = new EventEmitter<void>()
    @Output() eventSearch: EventEmitter<string> =
          new EventEmitter<string>();

  searchuser(): void {
        this.eventNewElement.emit();
    }

  initForm(object: SegUser): void {
    this.form = this._fb.group({
      nIdUsuario: [{ disabled: !object, value: object?.nIdUsuario }, Validators.required],
      sApellidoPaterno: [{ disabled: object, value: object ? object.sApellidoPaterno : '' }, [Validators.required, Validators.maxLength(50)]],
      sApellidoMaterno: [{ disabled: object, value: object ? object.sApellidoMaterno : '' }, [Validators.required, Validators.maxLength(50)]],
      sNombres: [{ disabled: object, value: object ? object.sNombres : '' }, [Validators.required, Validators.maxLength(150)]],
      nIdCargo: [object ? object.nIdCargo : 0, [Validators.required, Validators.min(1)]],
      nIdRol: [object ? object.nIdRol : 0, [Validators.required, Validators.min(1)]],
      nEstado: [object ? object.nEstado : 0, [Validators.required, Validators.min(1)]],
      sCorreoElectronico: [{ disabled: object, value: object ? object.sCorreoElectronico : '' }, [Validators.required, Validators.maxLength(150), this._validationFormService.validationMail]],
      sContrasena: [{ disabled: object, value: object ? '******' : '' }, [Validators.required, Validators.maxLength(32)]],
    });
  }

  returnInit(): void {
    this._router.navigate(['home']);
  }
  ngOnInit(): void {
    this.headerTable.set(COLUMNS_PROFILE_MANAGEMENT);
    // this.iconsTable.set(this.defineIconsTable());
    this.searchuser();
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

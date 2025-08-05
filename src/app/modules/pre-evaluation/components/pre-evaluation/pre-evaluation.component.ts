import { booleanAttribute, Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MinistryEntity } from 'app/modules/business/domain/entities/maintenance/ministry.entity';
import { COLUMNS_PROFILE_MANAGEMENT } from 'app/modules/user/config/profile-management.config';
import { SegUserEntity } from 'app/modules/user/domain/entities/profile/seg-user.entity';
import { IconOption } from 'app/shared/interfaces/generic-icon.interface';
import { TableColumnsDefInterface } from 'app/shared/interfaces/table-columns-def.interface';
import { ValidationFormService } from 'app/shared/services/validation-form.service';

@Component({
  selector: 'app-pre-evaluation',
  standalone: false,
  templateUrl: './pre-evaluation.component.html',
  styleUrl: './pre-evaluation.component.scss'
})
export class PreEvaluationComponent implements OnInit {

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
  dataTableActivities = signal<SegUserEntity[]>([]);
  iconsTable = signal<IconOption<SegUserEntity>[]>([]);

  ministries = signal<MinistryEntity[]>([]);
  form: FormGroup;

  @Output() eventNewElement: EventEmitter<void> = new EventEmitter<void>()
    @Output() eventSearch: EventEmitter<string> =
          new EventEmitter<string>();

  searchuser(): void {
        this._router.navigate(['solicitudes/home-pre-evaluation']);
    }
    
    ngOnInit(): void {
      this.initForm(null);
      this.headerTable.set(COLUMNS_PROFILE_MANAGEMENT);
      // this.iconsTable.set(this.defineIconsTable());
    }

  initForm(object: SegUserEntity): void {
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

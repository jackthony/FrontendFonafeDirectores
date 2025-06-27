/*******************************************************************************************************
 * Nombre del componente: CandidateMaintenanceComponent
 * Descripción:           Componente encargado de gestionar el mantenimiento de candidatos, incluyendo
 *                        búsqueda, filtrado por documento y visualización de resultados en tabla.
 *                        Se encarga de inicializar el formulario reactivo, manejar eventos de búsqueda,
 *                        navegación y validar el input del usuario.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Implementación del formulario de búsqueda reactivo.
 *                        - Integración con servicios de validación y navegación.
 *                        - Configuración dinámica de tabla y eventos de paginación.
 *******************************************************************************************************/
import { booleanAttribute, Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MinistryEntity } from 'app/modules/admin/business-management/domain/entities/ministry.entity';
import { SegUserEntity } from 'app/modules/admin/profile-management/domain/entities/seg-user.entity';
import { ConstantEntity } from 'app/modules/admin/shared/domain/entities/constant.entity';
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
  private readonly _router = inject(Router); // Servicio para la navegación
  private _fb = inject(FormBuilder); // Servicio para crear formularios reactivos
  private _validationFormService = inject(ValidationFormService); // Servicio de validación de formularios
  textBtnSearch = input<string>('Buscar');
  iconBtnSearch = input<string>('mat_outline:search');
  disableDirective = input(false, { transform: booleanAttribute });
  loadingTable = signal<boolean>(false);
  pageIndexTable = signal<number>(1);
  totalPagesTable = signal<number>(1);
  headerTable = signal<TableColumnsDefInterface[]>([]);
  dataTableActivities = signal<SegUserEntity[]>([]);
  iconsTable = signal<IconOption<SegUserEntity>[]>([]);
  lstTypedocument = input<ConstantEntity[]>([]);
  ministries = signal<MinistryEntity[]>([]); 
  form: FormGroup;
  @Output() eventNewElement: EventEmitter<void> = new EventEmitter<void>(); 
  @Output() eventSearch: EventEmitter<string> = new EventEmitter<string>(); 
  /**
   * Método de inicialización del componente
   */
  ngOnInit(): void {
    this.initForm();
    this.headerTable.set(COLUMNS_PROFILE_MANAGEMENT);
    this.valueChangesForm();
  }
  /**
   * Método para gestionar las reacciones en el formulario
   */
  valueChangesForm(): void {
    const tipoDocControl = this.form.get('nTipoDocumento');
    const numDocControl = this.form.get('sNumeroDocumento');
    if (!tipoDocControl?.value) {
      numDocControl?.disable();
    }
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
  /**
   * Método para realizar la búsqueda de usuarios
   */
  searchuser(): void {
  this._router.navigate(['/mantenimiento-candidatos/registro']);
  }
  /**
   * Método para inicializar el formulario
   */
  initForm(data?: Partial<{ nTipoDocumento: number; sNumeroDocumento: string; sApellidosNombres: string }>): void {
    this.form = this._fb.group({
      nTipoDocumento: [data?.nTipoDocumento ?? null, Validators.required],
      sNumeroDocumento: [data?.sNumeroDocumento ?? '', [Validators.required, Validators.maxLength(9)]],
      sApellidosNombres: [data?.sApellidosNombres ?? '', Validators.required],
    });
  }
  /**
   * Método para redirigir a la página de inicio
   */
  returnInit(): void {
    this._router.navigate(['home']);
  }
  /**
   * Método para filtrar las teclas permitidas (solo letras y espacios)
   */
  onKeyPress(event: KeyboardEvent) {
    const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
    if (!allowedRegex.test(event.key)) {
      event.preventDefault();
    }
  }
  /**
   * Método para cambiar la página de la tabla
   */
  changePageTable(event: number): void {
    this.pageIndexTable.set(event);
    this.searchuser();
  }
  /**
   * Método para limpiar y filtrar los valores de entrada
   */
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
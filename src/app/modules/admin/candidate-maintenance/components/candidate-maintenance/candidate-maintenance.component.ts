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

  // Inyección de dependencias
  private readonly _router = inject(Router); // Servicio para la navegación
  private _fb = inject(FormBuilder); // Servicio para crear formularios reactivos
  private _validationFormService = inject(ValidationFormService); // Servicio de validación de formularios

  // Definición de variables reactivas
  textBtnSearch = input<string>('Buscar'); // Texto para el botón de búsqueda
  iconBtnSearch = input<string>('mat_outline:search'); // Icono para el botón de búsqueda
  disableDirective = input(false, { transform: booleanAttribute }); // Controla si se desactiva la directiva
  loadingTable = signal<boolean>(false); // Indica si la tabla está cargando
  pageIndexTable = signal<number>(1); // Página actual de la tabla
  totalPagesTable = signal<number>(1); // Número total de páginas
  headerTable = signal<TableColumnsDefInterface[]>([]); // Definición de las columnas de la tabla
  dataTableActivities = signal<SegUserEntity[]>([]); // Datos de la tabla relacionados con los usuarios
  iconsTable = signal<IconOption<SegUserEntity>[]>([]); // Iconos personalizados para la tabla de usuarios
  lstTypedocument = input<ConstantEntity[]>([]); // Lista de tipos de documentos
  
  ministries = signal<MinistryEntity[]>([]); // Lista de ministerios disponibles
  form: FormGroup; // Formulario reactivo

  // Eventos de salida
  @Output() eventNewElement: EventEmitter<void> = new EventEmitter<void>(); // Evento para agregar un nuevo elemento
  @Output() eventSearch: EventEmitter<string> = new EventEmitter<string>(); // Evento para realizar la búsqueda

  /**
   * Método de inicialización del componente
   */
  ngOnInit(): void {
    this.initForm(); // Inicializa el formulario
    this.headerTable.set(COLUMNS_PROFILE_MANAGEMENT); // Establece las columnas de la tabla
    this.valueChangesForm(); // Activa las reacciones del formulario
  }

  /**
   * Método para gestionar las reacciones en el formulario
   */
  valueChangesForm(): void {
    const tipoDocControl = this.form.get('nTipoDocumento'); // Control para el tipo de documento
    const numDocControl = this.form.get('sNumeroDocumento'); // Control para el número de documento

    // Estado inicial: deshabilita el campo de número de documento si no hay tipo de documento
    if (!tipoDocControl?.value) {
      numDocControl?.disable();
    }

    // Reactividad: habilita o deshabilita el campo de número de documento según el tipo de documento seleccionado
    tipoDocControl?.valueChanges
      .pipe(distinctUntilChanged()) // Asegura que solo se emitan valores distintos
      .subscribe((value) => {
        if (value) {
          numDocControl?.enable(); // Habilita el campo de número de documento
        } else {
          numDocControl?.reset(); // Resetea el campo de número de documento
          numDocControl?.disable(); // Deshabilita el campo de número de documento
        }
        numDocControl?.markAsUntouched(); // Marca el campo como no tocado
      });
  }

  /**
   * Método para realizar la búsqueda de usuarios
   */
  searchuser(): void {

  this._router.navigate(['/mantenimiento-candidatos/registro']); // Redirige a la página de registro de candidatos


    
/*     if (this.form?.valid) {
      this.eventSearch.emit(this.form.value.sNumeroDocumento); // Emite el evento con el número de documento
    } else {
      this.form.markAllAsTouched(); // Marca todos los campos como tocados si el formulario es inválido
    } */
  }

  /**
   * Método para inicializar el formulario
   */
  initForm(data?: Partial<{ nTipoDocumento: number; sNumeroDocumento: string; sApellidosNombres: string }>): void {
    this.form = this._fb.group({
      nTipoDocumento: [data?.nTipoDocumento ?? null, Validators.required], // Campo para el tipo de documento
      sNumeroDocumento: [data?.sNumeroDocumento ?? '', [Validators.required, Validators.maxLength(9)]], // Campo para el número de documento
      sApellidosNombres: [data?.sApellidosNombres ?? '', Validators.required], // Campo para los apellidos y nombres
    });
  }

  /**
   * Método para redirigir a la página de inicio
   */
  returnInit(): void {
    this._router.navigate(['home']); // Redirige a la página de inicio
  }

  /**
   * Método para filtrar las teclas permitidas (solo letras y espacios)
   */
  onKeyPress(event: KeyboardEvent) {
    const allowedRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/; // Expresión regular que permite solo letras y espacios
    if (!allowedRegex.test(event.key)) {
      event.preventDefault(); // Previene el ingreso de caracteres no permitidos
    }
  }

  /**
   * Método para cambiar la página de la tabla
   */
  changePageTable(event: number): void {
    this.pageIndexTable.set(event); // Establece la página actual
    this.searchuser(); // Realiza la búsqueda con la nueva página
  }

  /**
   * Método para limpiar y filtrar los valores de entrada
   */
  onInput(event: Event, nameForm: string) {
    const input = event.target as HTMLInputElement; // Obtiene el valor del campo de entrada
    const validPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Expresión regular que permite solo letras y espacios

    // Si el valor no coincide con el patrón permitido, lo limpia
    if (!validPattern.test(input.value)) {
      const cleaned = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); // Elimina caracteres no permitidos
      input.value = cleaned; // Establece el valor limpio
      this.form.get(nameForm).setValue(cleaned, { emitEvent: false }); // Actualiza el valor del formulario sin emitir el evento
    }
  }
}
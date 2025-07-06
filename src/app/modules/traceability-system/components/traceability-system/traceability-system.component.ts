import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-traceability-system',
  standalone: false,
  templateUrl: './traceability-system.component.html',
  styleUrl: './traceability-system.component.scss'
})
export class TraceabilitySystemComponent {
  private readonly _router = inject(Router);
  iconBtnSearch = input<string>('mat_outline:add_circle_outline');
  textBtnSearch = input<string>('Descargar');
  @Output() eventNewElement: EventEmitter<void> = new EventEmitter<void>();
  form: FormGroup;
  /**
   * Método encargado de redirigir al usuario a la pantalla principal del sistema.
   * Se invoca usualmente desde el componente `FoReturnComponent`.
   */
  returnInit(): void {
    this._router.navigate(['home']);
  }
  addUser(): void {
    this.eventNewElement.emit();
  }
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

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-traceability-system',
  standalone: false,
  templateUrl: './traceability-system.component.html',
  styleUrl: './traceability-system.component.scss'
})
export class TraceabilitySystemComponent {
  private readonly _router = inject(Router);
  /**
   * Método encargado de redirigir al usuario a la pantalla principal del sistema.
   * Se invoca usualmente desde el componente `FoReturnComponent`.
   */
  returnInit(): void {
    this._router.navigate(['home']);
  }
}

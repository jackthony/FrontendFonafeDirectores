import { Component, inject } from '@angular/core';
import { FoContCardComponent } from '../../shared/components/fo-cont-card/fo-cont-card.component';
import { FoTitleModuleComponent } from '../../shared/components/fo-title-module/fo-title-module.component';
import { FoReturnComponent } from '../../shared/components/fo-return/fo-return.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-traceability-system',
  standalone: true,
  imports: [CommonModule, FoReturnComponent, FoTitleModuleComponent, FoContCardComponent],
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

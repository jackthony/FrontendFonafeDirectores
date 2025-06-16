import { Directive, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service';

@Directive({
    selector: '[appPermissionButton]',
    standalone: true,
})
export class PermissionButtonDirective {
  // Define los inputs que recibirán valores de las propiedades del HTML donde se use la directiva
  @Input('appPermissionButton') action: string = 'write'; // Acción para la que se verificará el permiso (por defecto 'write')
  @Input() module?: string; // Módulo sobre el que se verificará el permiso (opcional)
  @Input() mode: 'hide' | 'disable' = 'hide'; // Define si el botón debe ser ocultado o deshabilitado (por defecto 'hide')
  @Input() disableDirective: boolean = false; // Si es true, desactiva la directiva y no aplica ningún cambio al elemento

  // Inyecta las dependencias necesarias en el constructor
  constructor(
    private el: ElementRef<HTMLElement>, // Referencia al elemento del DOM donde se aplica la directiva
    private auth: AuthorizationService, // Servicio para verificar permisos
    private route: ActivatedRoute // Servicio para obtener información de la ruta activa
  ) {}

  /**
   * Método que se ejecuta cuando la directiva es inicializada.
   * Realiza la comprobación de permisos y aplica el modo correspondiente (ocultar o deshabilitar).
   */
  ngOnInit(): void {
    // Si la directiva está deshabilitada, no realiza ninguna acción
    if(this.disableDirective) return;

    // Si no se proporciona un módulo, se obtiene del snapshot de la ruta activa
    const resolvedModule = this.module ?? this.route.snapshot.data['module'];

    // Si no se encontró el módulo, se muestra una advertencia y se aplica el modo de ocultar
    if (!resolvedModule) {
      console.warn('[PermissionButtonDirective] No se encontró módulo.');
      this.applyMode(false); // No tiene acceso, oculta el elemento
      return;
    }

    // Verifica si el usuario tiene permiso para realizar la acción en el módulo especificado
    const hasAccess = this.auth.canPerform(resolvedModule, this.action || 'write');
    
    // Aplica el modo correspondiente (ocultar o deshabilitar) según si el usuario tiene acceso
    this.applyMode(hasAccess);
  }

  /**
   * Método privado que aplica el modo 'hide' o 'disable' dependiendo de los permisos.
   * @param hasAccess Indica si el usuario tiene acceso para realizar la acción.
   */
  private applyMode(hasAccess: boolean): void {
    if (this.mode === 'hide') {
      // Si el modo es 'hide', oculta el elemento si no tiene acceso
      this.el.nativeElement.style.display = hasAccess ? '' : 'none';
    } else if (this.mode === 'disable') {
      // Si el modo es 'disable', deshabilita el elemento si tiene propiedad 'disabled'
      if ('disabled' in this.el.nativeElement) {
        (this.el.nativeElement as any).disabled = !hasAccess; // Si tiene 'disabled', lo habilita o deshabilita
      } else {
        // Si no tiene 'disabled', simula el comportamiento de deshabilitarlo
        this.el.nativeElement.style.pointerEvents = hasAccess ? '' : 'none'; // Desactiva los eventos de puntero
        this.el.nativeElement.style.opacity = hasAccess ? '' : '0.5'; // Ajusta la opacidad para simular un botón deshabilitado
      }
    }
  }
}
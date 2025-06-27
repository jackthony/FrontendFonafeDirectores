/*******************************************************************************************************
 * Nombre del archivo: permission-button.directive.ts
 * Descripción:         Directiva para controlar permisos de acción sobre botones u otros elementos
 *                      según el módulo actual y las configuraciones de seguridad del usuario.
 * Autor:               Daniel Alva
 * Última modificación: 23/06/2025
 *******************************************************************************************************/
import { Directive, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service';
@Directive({
    selector: '[appPermissionButton]',
    standalone: true,
})
export class PermissionButtonDirective {
  @Input('appPermissionButton') action: string = 'write';
  @Input() module?: string;
  @Input() mode: 'hide' | 'disable' = 'hide';
  @Input() disableDirective: boolean = false;
  constructor(
    private el: ElementRef<HTMLElement>,
    private auth: AuthorizationService,
    private route: ActivatedRoute
  ) {}
  /**
   * Método que se ejecuta cuando la directiva es inicializada.
   * Realiza la comprobación de permisos y aplica el modo correspondiente (ocultar o deshabilitar).
   */
  ngOnInit(): void {
    if(this.disableDirective) return;
    const resolvedModule = this.module ?? this.route.snapshot.data['module'];
    console.log('resolverModule', resolvedModule);
    
    if (!resolvedModule) {
      console.warn('[PermissionButtonDirective] No se encontró módulo.');
      this.applyMode(false); // No tiene acceso, oculta el elemento
      return;
    }
    const hasAccess = this.auth.canPerform(resolvedModule, this.action || 'write');
    console.log('hasacces', hasAccess);
    console.log('this.action', this.action);
    
    this.applyMode(hasAccess);
  }
  /**
   * Método privado que aplica el modo 'hide' o 'disable' dependiendo de los permisos.
   * @param hasAccess Indica si el usuario tiene acceso para realizar la acción.
   */
  private applyMode(hasAccess: boolean): void {
    if (this.mode === 'hide') {
      this.el.nativeElement.style.display = hasAccess ? '' : 'none';
    } else if (this.mode === 'disable') {
      if ('disabled' in this.el.nativeElement) {
        (this.el.nativeElement as any).disabled = !hasAccess; 
      } else {
        this.el.nativeElement.style.pointerEvents = hasAccess ? '' : 'none';
        this.el.nativeElement.style.opacity = hasAccess ? '' : '0.5';
      }
    }
  }
}
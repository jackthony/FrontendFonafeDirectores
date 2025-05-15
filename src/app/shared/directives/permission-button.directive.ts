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

  ngOnInit(): void {
    if(this.disableDirective) return;
    // Obtén el módulo del input o la ruta
    const resolvedModule = this.module ?? this.route.snapshot.data['module'];

    if (!resolvedModule) {
      console.warn('[PermissionButtonDirective] No se encontró módulo.');
      this.applyMode(false);
      return;
    }


    const hasAccess = this.auth.canPerform(resolvedModule, this.action || 'write');

    console.log('this.atuhh', this.auth.getPermission());
    

    console.log('resolvedModule',resolvedModule)
    console.log('hasACcess', hasAccess);
    console.log('hasACcess', this.mode);
    
    this.applyMode(hasAccess);
  }

  private applyMode(hasAccess: boolean): void {
    if (this.mode === 'hide') {
        console.log('ENTROOO AL HIDE');
        
      // Oculta el elemento si no tiene acceso
      this.el.nativeElement.style.display = hasAccess ? '' : 'none';
    } else if (this.mode === 'disable') {
      // Deshabilita el elemento si tiene propiedad disabled, sino simula deshabilitado
      if ('disabled' in this.el.nativeElement) {
        (this.el.nativeElement as any).disabled = !hasAccess;
      } else {
        this.el.nativeElement.style.pointerEvents = hasAccess ? '' : 'none';
        this.el.nativeElement.style.opacity = hasAccess ? '' : '0.5';
      }
    }
  }
}

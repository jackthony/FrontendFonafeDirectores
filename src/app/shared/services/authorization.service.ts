import { Injectable } from '@angular/core';
import { Permission } from '@models/permission.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthorizationService {
    private userPermissions = new BehaviorSubject<Permission[]>([/* 
        { module: 'gestion-perfiles', actions: ['read', 'write'] },
        { module: 'gestion-empresas', actions: ['read'] }
     */]);

    setPermissions(perms: Permission[]) {
        this.userPermissions.next(perms);
    }

    getPermission() {
        return this.userPermissions.value;
    }

    canPerform(module: string, action: string): boolean {
        const perms = this.userPermissions.value;
        const permission = perms.find((p) => p.module === module);
        return permission ? permission.actions.includes(action) : false;
    }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { businessResolver } from './infrastructure/business/resolvers/business.resolver';
import { BusinessManagementComponent } from './components/business/business-management/business-management.component';
import { BusinessFormComponent } from './components/business/business-form/business-form.component';
import { permissionGuard } from '../user/guards/permission.guard';

const routes: Routes = [
	{
        path     : '',
        component: BusinessManagementComponent,
        canActivate: [permissionGuard],
        data: { module: 'gestion-empresas', action: 'Ver' }
    },
    {
        path     : 'registro',
        component: BusinessFormComponent,
        canActivate: [permissionGuard],
        resolve: {
            data: businessResolver
        },
        data: { module: 'gestion-empresas', action: 'Ver' }
    },
    {
        path     : 'registro/:id',
        component: BusinessFormComponent,
        canActivate: [permissionGuard],
        resolve: {
            data: businessResolver
        },
        data: { module: 'gestion-empresas', action: 'Ver' }
    },
    {
		path: 'mantenimiento',
		loadChildren: () => import('./components/maintenance/maintenance-business.module'),
		canActivate: [permissionGuard],
		canActivateChild: [permissionGuard],
		data: { module: 'mantenimiento-sistemas', action: 'Ver' }
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessManagementRoutingModule { }

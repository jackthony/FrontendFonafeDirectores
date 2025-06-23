import { Routes } from '@angular/router';
import { BusinessManagementComponent } from './components/business-management/business-management.component';
import { BusinessFormComponent } from './components/business-form/business-form.component';
import { businessResolver } from './infrastructure/resolvers/business.resolver';

export default [
    {
        path     : '',
        component: BusinessManagementComponent,
    },
    {
        path     : 'registro',
        component: BusinessFormComponent,
        resolve: {
            data: businessResolver
        }
    },
    {
        path     : 'registro/:id',
        component: BusinessFormComponent,
        resolve: {
            data: businessResolver
        }
    },
] as Routes;

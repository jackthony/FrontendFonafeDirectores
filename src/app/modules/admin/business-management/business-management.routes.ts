import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { BusinessManagementComponent } from './business-management.component';
import { BusinessFormComponent } from './business-form/business-form.component';
import { businessResolver } from 'app/core/resolvers/business.resolver';

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

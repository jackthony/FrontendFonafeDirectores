import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { BusinessManagementComponent } from './business-management.component';
import { BusinessFormComponent } from './business-form/business-form.component';

export default [
    {
        path     : '',
        component: BusinessManagementComponent
    },
    {
        path     : 'registro',
        component: BusinessFormComponent
    },
] as Routes;

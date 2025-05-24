import { Routes } from '@angular/router';
import CandidateMaintenanceComponent from './candidate-maintenance.component';
import { CandidateFormComponent } from './candidate-form/candidate-form.component';

export default [
    {
        path     : '',
        component: CandidateMaintenanceComponent,
    },
    {
        path     : ':id',
        component: CandidateFormComponent,
    },

] as Routes;

import { Routes } from '@angular/router';

import { CandidateFormComponent } from './candidate-form/candidate-form.component';
import { CandidateMaintenanceComponent } from './candidate-maintenance.component';

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

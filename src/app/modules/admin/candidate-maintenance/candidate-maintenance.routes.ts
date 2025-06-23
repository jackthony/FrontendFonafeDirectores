import { Routes } from '@angular/router';

import { CandidateFormComponent } from './components/candidate-form/candidate-form.component';
import { CandidateMaintenanceComponent } from './components/candidate-maintenance/candidate-maintenance.component';

export default [
    {
        path     : '',
        component: CandidateMaintenanceComponent,
    },
    {
        path     : 'registro',
        component: CandidateFormComponent,
    },

] as Routes;

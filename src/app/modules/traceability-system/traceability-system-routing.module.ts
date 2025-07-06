import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraceabilitySystemComponent } from './components/traceability-system.component';

const routes: Routes = [
	{
        path     : '',
        component: TraceabilitySystemComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraceabilitySystemRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TraceabilitySystemRoutingModule } from './traceability-system-routing.module';
import { FoReturnComponent } from 'app/shared/components/fo-return/fo-return.component';
import { FoTitleModuleComponent } from 'app/shared/components/fo-title-module/fo-title-module.component';
import { FoContCardComponent } from 'app/shared/components/fo-cont-card/fo-cont-card.component';
import { TraceabilitySystemComponent } from './components/traceability-system.component';


@NgModule({
  declarations: [TraceabilitySystemComponent],
  imports: [
    CommonModule,
    TraceabilitySystemRoutingModule,
    FoReturnComponent, 
    FoTitleModuleComponent, 
    FoContCardComponent
  ]
})
export default class TraceabilitySystemModule { }

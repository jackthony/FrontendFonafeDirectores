import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { Error500Component } from './components/error-500/error-500.component';
import { Error404Component } from './components/error-404/error-404.component';
import { RouterLink } from '@angular/router';


@NgModule({
  declarations: [
    Error404Component,
    Error500Component
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    RouterLink
  ]
})
export default class SharedModule { }

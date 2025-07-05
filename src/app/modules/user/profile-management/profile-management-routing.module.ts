import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileManagementComponent } from './components/profile-management/profile-management.component';

const routes: Routes = [
  	{
		path: '',
		component: ProfileManagementComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileManagementRoutingModule { }

import { CommonModule } from "@angular/common";
import { FoContCardComponent } from "@components/fo-cont-card/fo-cont-card.component";
import { FoReturnComponent } from "@components/fo-return/fo-return.component";
import { FoTableComponent } from "@components/fo-table/fo-table.component";
import { FoTitleModuleComponent } from "@components/fo-title-module/fo-title-module.component";
import { SearchUsersComponent } from "app/modules/admin/profile-management/search-users/search-users.component";

export const PROFILE_MANAGEMENT_IMPORTS = [
  CommonModule,
  FoReturnComponent,
  FoContCardComponent,
  FoTitleModuleComponent,
  SearchUsersComponent,
  FoTableComponent
];
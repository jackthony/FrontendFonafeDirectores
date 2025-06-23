import { CommonModule } from "@angular/common";
import { FoContCardComponent } from "app/modules/admin/shared/components/fo-cont-card/fo-cont-card.component";
import { FoReturnComponent } from "app/modules/admin/shared/components/fo-return/fo-return.component";
import { FoSearchForButtonComponent } from "app/modules/admin/shared/components/fo-search-for-button/fo-search-for-button.component";
import { FoTableComponent } from "app/modules/admin/shared/components/fo-table/fo-table.component";
import { FoTitleModuleComponent } from "app/modules/admin/shared/components/fo-title-module/fo-title-module.component";
import { PermissionButtonDirective } from "app/shared/directives/permission-button.directive";
export const MAINTENANCE_GENERAL_IMPORTS = [
  CommonModule,
  FoReturnComponent,
  FoTitleModuleComponent,
  FoTableComponent,
  FoSearchForButtonComponent,
  FoContCardComponent,
  PermissionButtonDirective
];
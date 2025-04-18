import { CommonModule } from "@angular/common";
import { FoContCardComponent } from "@components/fo-cont-card/fo-cont-card.component";
import { FoReturnComponent } from "@components/fo-return/fo-return.component";
import { FoSearchForButtonComponent } from "@components/fo-search-for-button/fo-search-for-button.component";
import { FoTableComponent } from "@components/fo-table/fo-table.component";
import { FoTitleModuleComponent } from "@components/fo-title-module/fo-title-module.component";

export const BUSINESS_MANAGEMENT_IMPORTS = [
  CommonModule,
  FoReturnComponent,
  FoContCardComponent,
  FoTitleModuleComponent,
  FoTableComponent,
  FoSearchForButtonComponent
];
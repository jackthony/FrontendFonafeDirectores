import { CommonModule } from "@angular/common";
import { FoTableComponent } from "@components/fo-table/fo-table.component";
import { SubTitleCardComponent } from "@components/sub-title-card/sub-title-card.component";
import { BannerInformativeComponent } from "app/modules/admin/home/banner-informative/banner-informative.component";
import { MyProcessesComponent } from "app/modules/admin/home/my-processes/my-processes.component";
export const HOME_IMPORTS = [
  CommonModule, 
  BannerInformativeComponent, 
  SubTitleCardComponent, 
  FoTableComponent,
  MyProcessesComponent
];
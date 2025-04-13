import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BooleanPipe } from "app/core/pipes/boolean.pipe";
import { EmptyPipe } from "app/core/pipes/empty.pipe";

export const FO_TABLE_IMPORTS = [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    EmptyPipe,
    BooleanPipe,
    //BuPaginatorTableComponent,
    //NgxSkeletonLoaderModule,
    MatTooltipModule,
    MatProgressBarModule
  ];
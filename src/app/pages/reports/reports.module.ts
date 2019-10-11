import { NgModule } from '@angular/core';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartModule } from 'primeng/chart'


@NgModule({
  declarations: [ReportsComponent],
  imports: [
    ReportsRoutingModule,
    SharedModule,
    ChartModule
  ]
})
export class ReportsModule { }

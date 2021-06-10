
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';


import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashviewComponent } from './dashview/dashview.component';
import { ApplicationComponent } from './application/application.component';
import { MoreappComponent } from './moreapp/moreapp.component';
import { ApplinksComponent } from './applinks/applinks.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { SlaComponent } from './sla/sla.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AwaitingApprovalComponent } from './awaiting-approval/awaiting-approval.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AwaitingResolverComponent } from './awaiting-resolver/awaiting-resolver.component';



@NgModule({

  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatIconModule,
    SharedModule,
    // NgScrollbarModule

    NgxChartsModule,

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],


  declarations:[
    DashviewComponent,
    ApplicationComponent,
    MoreappComponent,
    ApplinksComponent,
    MyRequestsComponent,
    SlaComponent, AwaitingApprovalComponent, AwaitingResolverComponent,
  ]

})
export class DashboardModule { }

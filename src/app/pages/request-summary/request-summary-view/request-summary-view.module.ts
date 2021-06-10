import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestSummaryViewComponent } from './request-summary-view.component';
import { RequestSummaryViewRoutingModule } from './request-summary-view-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { PersonalRequestComponent } from '../personal-request/personal-request.component';
import { RequestApprovalComponent } from '../request-approval/request-approval.component';
import { RequestHistoryComponent } from '../request-history/request-history.component';
// import { RequestViewComponent } from '../../request/request-view/request-view.component';
import { ApprovalpageComponent } from '../../approval/approvalpage/approvalpage.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ResolverHistoryComponent } from '../resolver-history/resolver-history.component';
// import { NgxDonutChartModule } from 'ngx-doughnut-chart';

@NgModule({
  declarations: [
    RequestSummaryViewComponent,
    PersonalRequestComponent,
    RequestApprovalComponent,
    RequestHistoryComponent,
    ResolverHistoryComponent
   
    ],
  imports: [
    CommonModule,
    RequestSummaryViewRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    Ng2SearchPipeModule,
    // NgxDonutChartModule
  ],
    
  providers: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class RequestSummaryViewModule { }

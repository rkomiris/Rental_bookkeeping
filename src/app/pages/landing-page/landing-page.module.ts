import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { FullCalendarModule } from 'ng-fullcalendar';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { WidgetDetailComponent } from './widget-detail/widget-detail.component';
import { WidgetReadmoreDetailComponent } from './widget-readmore-detail/widget-readmore-detail.component';
import { WidgetMoreDetailComponent } from './widget-more-detail/widget-more-detail.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HolidayCalendarPopupComponent } from './holiday-calendar-popup/holiday-calendar-popup.component';
import { HolidayDetailsTableViewComponent } from './holiday-calendar-popup/holiday-details-table-view/holiday-details-table-view.component';
import { PreviewComponent } from './widget-detail/preview/preview.component';
import { MAT_DATE_LOCALE } from '@angular/material';



@NgModule({
  declarations: [
    LandingPageComponent,
    WidgetDetailComponent,
    WidgetReadmoreDetailComponent,
    WidgetMoreDetailComponent,
    HolidayCalendarPopupComponent,
    HolidayDetailsTableViewComponent,
    PreviewComponent
  ],

  imports: [
    CommonModule,
    LandingPageRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FullCalendarModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    NgScrollbarModule
  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents:[WidgetDetailComponent, HolidayCalendarPopupComponent, 
    PreviewComponent,HolidayDetailsTableViewComponent],
    providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    ]
})
export class LandingPageModule { }


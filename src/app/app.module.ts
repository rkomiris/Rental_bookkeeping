import { WidgetDetailComponent } from './pages/landing-page/widget-detail/widget-detail.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { HeaderComponent } from './shared/layout/app-layout/header/header.component';
import { FooterComponent } from './shared/layout/app-layout/footer/footer.component';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import {DatePipe} from '@angular/common';
import { NgChatModule } from 'ng-chat';
// import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
// import { environment} from '../environments/environment';


// const config: SocketIoConfig = { url: environment.chaturl, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,   
    
    // HolidayDetailsComponent,
   // RoombookapprovalComponent,
  //  UserMapComponent,
  // PhoneBookDetailsComponent,
 //   PhoneComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    MatExpansionModule,
    NgChatModule,
    // SocketIoModule.forRoot(config),
    // FullCalendarModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule { }

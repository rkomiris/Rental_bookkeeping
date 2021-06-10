import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { EntityComponent } from '../entity/entity.component';
import { SubscriptionComponent } from '../subscription/subscription.component';
import { MAT_DATE_LOCALE } from '@angular/material';


@NgModule({
  declarations: [LoginComponent,EntityComponent, SubscriptionComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers:[{ provide: MAT_DATE_LOCALE, useValue: 'en-GB'},],
  entryComponents: [EntityComponent,SubscriptionComponent]
})
export class LoginModule { }


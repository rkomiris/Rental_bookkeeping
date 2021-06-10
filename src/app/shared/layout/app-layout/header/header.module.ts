import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { RouterModule } from '@angular/router';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { EntityHomeComponent } from './entity-home/entity-home.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    I18nModule
  ],
  exports: [
    // HeaderComponent
    I18nModule
  ],
  providers:[
    JsonApiService
  ],
  entryComponents : []
})
export class HeaderModule { }

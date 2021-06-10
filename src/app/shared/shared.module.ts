import { NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BootstrapModule } from "./bootstrap.module";
import { MaterialModule } from "./material.module";
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MaterialFileInputModule,FileInputConfig,NGX_MAT_FILE_INPUT_CONFIG } from 'ngx-material-file-input';
import { LeftNavModule } from './left-nav/left-nav.module';
import {TasksModule} from './tasks/tasks.module';
import { ArrayFilterPipe } from './array-filter.pipe';
import { PersonalSearchDialogComponent } from '../pages/request-summary/personal-request/personal-search-dialog/personal-search-dialog.component';
import { RequestViewComponent } from '../pages/request/request-view/request-view.component';
import { DropdownFilterPipe } from './dropdown-filter.pipe';
import {SlideshowModule} from 'ng-simple-slideshow';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { I18nModule } from './i18n/i18n.module';
import { I18nPipe } from './i18n/i18n.pipe';
import { EntityHomeComponent } from './layout/app-layout/header/entity-home/entity-home.component';




export const config: FileInputConfig = {
  sizeUnit: 'Octet'
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BootstrapModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialFileInputModule,
    LeftNavModule,
    TasksModule,
    SlideshowModule, 
    I18nModule,
  ],

  declarations: [
    ConfirmationDialogComponent,
    ArrayFilterPipe,
    PersonalSearchDialogComponent,
    RequestViewComponent,
    DropdownFilterPipe,
    EntityHomeComponent
  ],

  entryComponents: [
    ConfirmationDialogComponent,
    PersonalSearchDialogComponent,
    EntityHomeComponent
  ],

  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BootstrapModule,
    MaterialFileInputModule,
    LeftNavModule,
    TasksModule,
    ArrayFilterPipe,
    RequestViewComponent,
    DropdownFilterPipe,
    SlideshowModule,
    I18nModule,
    I18nPipe
  ],

  providers: [{ provide: NGX_MAT_FILE_INPUT_CONFIG, useValue: config },
    JsonApiService]
})

export class SharedModule { }

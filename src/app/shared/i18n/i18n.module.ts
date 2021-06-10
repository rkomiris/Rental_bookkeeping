import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { I18nPipe } from './i18n.pipe';
import { I18nService } from './i18n.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    I18nPipe
  ],
  exports: [I18nPipe],
  providers: [I18nService]

})
export class I18nModule {
  static forRoot() {
    return {
      ngModule: I18nModule,
      providers: [I18nService]
    };
  }
 }

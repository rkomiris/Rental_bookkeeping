import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FooterComponent } from './footer.component';
import { MaterialModule } from '../../../material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  // declarations: [FooterComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  // exports: [
  //   FooterComponent
  // ]
})
export class FooterModule { }

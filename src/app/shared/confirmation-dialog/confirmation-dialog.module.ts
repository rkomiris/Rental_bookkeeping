import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  // declarations: [ConfirmationDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ]
})
export class ConfirmationDialogModule { }

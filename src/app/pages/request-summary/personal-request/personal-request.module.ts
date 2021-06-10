import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
// import { PersonalRequestComponent } from './personal-request.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { PersonalRequestService } from './personal-request.service';
import { MAT_DATE_LOCALE } from '@angular/material';


@NgModule({
  // declarations: [PersonalRequestComponent],
  imports: [
    
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    // Ng2SearchPipeModule
  ],
  providers: [PersonalRequestService,
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    ]
})
export class PersonalRequestModule { }



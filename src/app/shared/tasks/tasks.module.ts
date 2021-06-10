import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TaskModalComponent } from './task-modal/task-modal.component';
import { JsonApiService } from 'src/assets/api/json-api.service';


@NgModule({
  declarations: [TasksComponent, TaskModalComponent],
  imports: [
    CommonModule,
    MatIconModule,
    NgScrollbarModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    // SharedModule
  ],
  exports: [
    TasksComponent,
    TaskModalComponent
  ],
  providers:[
  JsonApiService],
  entryComponents:[TaskModalComponent]
})
export class TasksModule { }

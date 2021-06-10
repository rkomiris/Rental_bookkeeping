import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlashNewsModifyComponent } from './flash-news-modify.component';

const routes: Routes = [{
  path: '',
  component: FlashNewsModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlashNewsModifyRoutingModule { }


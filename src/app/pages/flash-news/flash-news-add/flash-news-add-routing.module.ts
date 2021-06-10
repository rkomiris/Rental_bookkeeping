import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlashNewsAddComponent } from './flash-news-add.component';

const routes: Routes = [{
  path: '',
  component: FlashNewsAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlashNewsAddRoutingModule { }


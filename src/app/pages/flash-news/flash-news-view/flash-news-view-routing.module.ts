import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlashNewsViewComponent } from './flash-news-view.component';

const routes: Routes = [{
  path: '',
  component: FlashNewsViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlashNewsViewRoutingModule { }


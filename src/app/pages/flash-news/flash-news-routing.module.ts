import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlashNewsComponent } from './flash-news.component';

const routes: Routes = [{
  path: '',
  component: FlashNewsComponent
},
{
  path: "flash-news-add",
  loadChildren: "./flash-news-add/flash-news-add.module#FlashNewsAddModule"
},
{
  path: "flash-news-modify",
  loadChildren: "./flash-news-modify/flash-news-modify.module#FlashNewsModifyModule"
},
{
  path: "flash-news-view",
  loadChildren: "./flash-news-view/flash-news-view.module#FlashNewsViewModule"
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlashNewsRoutingModule { }


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SublocationViewComponent } from './sublocation-view.component';

const routes: Routes = [{
  path: '',
  component: SublocationViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SublocationViewRoutingModule { }

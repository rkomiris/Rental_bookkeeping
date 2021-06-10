import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AminiteViewComponent } from './aminite-view.component';

const routes: Routes = [{
  path: 'amenity-view',
  component: AminiteViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AminiteViewRoutingModule { }

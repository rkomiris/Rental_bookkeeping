import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AminiteAddComponent } from './aminite-add.component';

const routes: Routes = [{
  path: 'amenity-add',
  component: AminiteAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AminiteAddRoutingModule { }

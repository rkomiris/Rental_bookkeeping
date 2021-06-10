import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AminiteModifyComponent } from './aminite-modify.component';

const routes: Routes = [{
  path: 'amenity-modify',
  component:AminiteModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AminiteModifyRoutingModule { }

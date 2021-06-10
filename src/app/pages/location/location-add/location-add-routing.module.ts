import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationAddComponent } from './location-add.component';

const routes: Routes = [{
  path: '',
  component: LocationAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationAddRoutingModule { }

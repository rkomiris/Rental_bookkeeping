import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationViewComponent } from './location-view.component';
const routes: Routes = [{
  path: '',
  component: LocationViewComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationViewRoutingModule { }

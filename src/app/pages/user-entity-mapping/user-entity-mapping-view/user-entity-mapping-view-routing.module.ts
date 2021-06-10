import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserEntityMappingViewComponent } from './user-entity-mapping-view.component';

const routes: Routes = [{
  path: '',
  component: UserEntityMappingViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserEntityMappingViewRoutingModule { }

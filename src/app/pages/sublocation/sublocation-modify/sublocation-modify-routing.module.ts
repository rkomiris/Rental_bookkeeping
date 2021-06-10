
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SublocationModifyComponent } from './sublocation-modify.component';

const routes: Routes = [{
  path: '',
  component: SublocationModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SublocationModifyRoutingModule { }


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SublocationAddComponent } from './sublocation-add.component';

const routes: Routes = [{
  path: '',
  component: SublocationAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SublocationAddRoutingModule { }

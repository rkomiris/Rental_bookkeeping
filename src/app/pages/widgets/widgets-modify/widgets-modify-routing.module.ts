
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetsModifyComponent } from './widgets-modify.component';

const routes: Routes = [
  {
    path: '',
    component: WidgetsModifyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetsModifyRoutingModule {}

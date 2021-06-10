import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoombookapprovalComponent } from './roombookapproval.component';
const routes: Routes = [{
  path: '',
  component: RoombookapprovalComponent
},
{
  path: 'roombookapprovalmodify',
  loadChildren: './roombookapprovalmodify/roombookapprovalmodify.module#RoombookapprovalmodifyModule'
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoombookapprovalRoutingModule { }

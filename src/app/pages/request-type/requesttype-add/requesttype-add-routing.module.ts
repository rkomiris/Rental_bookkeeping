import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequesttypeAddComponent } from './requesttype-add.component';


const routes: Routes = [{
  path: '',
  component:RequesttypeAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RequesttypeAddRoutingModule { }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { AminiteViewService } from './aminite-view.service';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
@Component({
  selector: 'app-aminite-view',
  templateUrl: './aminite-view.component.html',
  styleUrls: ['./aminite-view.component.css']
})
export class AminiteViewComponent implements OnInit , OnDestroy{
  viewForm: FormGroup;
  userBaseFieldName: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private aminiteViewService: AminiteViewService,
    private componentLoaderService: ComponentLoaderService) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.aminite_list_view();
    this.viewForm = this.formBuilder.group({
      amenityCode:["",  ],
      amenityName:["" ],
      amenityActive:[""],
      amenityVoList : [null],
      amenityList : [null],
      amenityId : [null]
    });
  }
  aminite_list_view() {
    let tempData = JSON.parse(window.localStorage.getItem('aminiteId'));
    this.aminiteViewService.load_view_project(tempData).subscribe(data => {
      let aminiteViewListGetData = JSON.parse(data['_body']);
      let aminiteViewList_TableData = aminiteViewListGetData.succesObject;
      this.userBaseFieldName = aminiteViewListGetData.succesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.viewForm.patchValue(aminiteViewList_TableData);
      this.componentLoaderService.display(false);
    }, error => {
      if(error.status === 401)
      {
        console.log("Error");
      }
    });
}
ngOnDestroy(){
  localStorage.removeItem('aminiteId');
}
}


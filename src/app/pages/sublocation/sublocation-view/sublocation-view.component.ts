import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource,VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SublocationViewService } from './sublocation-view.service';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-sublocation-view',
  templateUrl: './sublocation-view.component.html',
  styleUrls: ['./sublocation-view.component.css']
})
export class SublocationViewComponent implements OnInit 
{
  viewForm: FormGroup;
  SL_selectFormGetDate : any;
  userBaseFieldName: any = [];
  labels: any = {}; /** LABEL CHANGES **/
  
  constructor(private componentLoaderService: ComponentLoaderService, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private dialog: MatDialog, 
    private sublocationViewService: SublocationViewService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/) { }
  
    ngOnInit() {
    this.componentLoaderService.display(true);
    this.viewForm = this.formBuilder.group({
      subLocationCode: ["",],
      id: ["", Validators.required],
      subLocationName: ["", Validators.required],
      subLocationIsActive: ["", Validators.required],
    });
    this.onloadSelectboxData();
    this.sublocation_list_view();
    this.getLabelDetails();
  }
  getLabelDetails() {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }

  sublocation_list_view() {
    let tempData = JSON.parse(window.localStorage.getItem('sublocationId'));
    this.sublocationViewService.load_modify_project(tempData).subscribe(data => {
      let subLocationModifyListGetData = JSON.parse(data['_body']);
      let subLocationModifyList_TableData = subLocationModifyListGetData.succesObject;
      this.userBaseFieldName = subLocationModifyListGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.viewForm.patchValue(subLocationModifyList_TableData);
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
}
onloadSelectboxData() {
  let loadSelectBoxList = this.sublocationViewService.load_selectBoxData().subscribe(data => {
    let SL_selectGetData = JSON.parse(data['_body']);
    this.SL_selectFormGetDate = SL_selectGetData.succesObject;
  }, error => {
    if (error.status === 401) {
      console.log("Error");
    }
  })
}
ngOnDestroy(){
  localStorage.removeItem('sublocationId');
}

}

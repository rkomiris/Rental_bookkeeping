
import { Component, OnInit, OnDestroy} from '@angular/core';
import {MatDialog } from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Router } from "@angular/router";
import { RequestSubtypeViewService } from './request-subtype-view.service';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-request-subtype-view',
  templateUrl: './request-subtype-view.component.html',
  styleUrls: ['./request-subtype-view.component.css']
})
export class RequestSubtypeViewComponent implements OnInit, OnDestroy {

  labels: any = {}; /** LABEL CHANGES **/
  viewForm: FormGroup;
  RST_selectFormGetDate : any;
  userBaseFieldName: any = [];
  priorityArr = [];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private requestSubtypeViewService: RequestSubtypeViewService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private componentLoaderService: ComponentLoaderService) {
      this.RST_selectFormGetDate = [];
     }
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.viewForm = this.formBuilder.group({
      requestSubTypeCode:["", ],
      requestTypeId:["",  ],
      requestSubTypeName:["",  ],
      requestSubTypeIsActive:["", ],
      requestSubtypePriorty: ['']
    });
    this.onloadSelectboxData();
    this.reqsubtype_list_view();
  }
   /** LABEL CHANGES **/
   getLabelDetails() {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
    this.labels = data;
    });
    if(localStorage.getItem('langCode') == 'en' ){
      this.priorityArr = [
        { name: 'Low', value: '1' },
        { name: 'Mediuim', value: '2' },
        { name: 'High', value: '3' }];
    }else if(localStorage.getItem('langCode') == 'jp'){
      this. priorityArr = [
        { name: '低い', value: '1' },
        { name: '中', value: '2' },
        { name: '高い', value: '3' }];
    }
  }
  reqsubtype_list_view() {
    let tempData = JSON.parse(window.localStorage.getItem('requestSubTypeId'));
    this.requestSubtypeViewService.load_view_project(tempData).subscribe(data => {
      let reqSubTypeViewListGetData = JSON.parse(data['_body']);
      let reqSubTypeViewList_TableData = reqSubTypeViewListGetData.succesObject;
      this.userBaseFieldName = reqSubTypeViewListGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.viewForm.patchValue(reqSubTypeViewList_TableData);
      this.componentLoaderService.display(false);
    }, error => {
      if(error.status === 401)
      {
        console.log("Error");
      }
    })
}
onloadSelectboxData() {
  let loadSelectBoxList = this.requestSubtypeViewService.load_selectBoxData().subscribe(data => {
    let RST_selectGetData = JSON.parse(data['_body']);
    this.RST_selectFormGetDate = RST_selectGetData.succesObject;
  }, error => {
    if(error.status === 401)
    {
      console.log("Error");
    }
  })
}
ngOnDestroy(){
  localStorage.removeItem('requestSubTypeId');
}
}

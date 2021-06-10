
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from "@angular/router";
import { RequesttypeViewService } from './requesttype-view.service';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-requesttype-view',
  templateUrl: './requesttype-view.component.html',
  styleUrls: ['./requesttype-view.component.css']
})
export class RequesttypeViewComponent implements OnInit, OnDestroy {
  labels: any = {}; /** LABEL CHANGES **/
  viewForm: FormGroup;
  userBaseFieldName: any = [];
  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private requesttypeViewService: RequesttypeViewService,
    private componentLoaderService: ComponentLoaderService
  ) { }
  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.viewForm = this.formBuilder.group({
      requestTypeCode: ["",],
      requestTypeName: ["",],
      requestTypeUrl: ["",],
      requestTypeIsActive: ["",],
    });
    this.master_list_view();
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
  }
  master_list_view() {
    let tempData = JSON.parse(window.localStorage.getItem('requestTypeId'));
    this.requesttypeViewService.load_view_project(tempData).subscribe(data => {
      let masterViewListGetData = JSON.parse(data['_body']);
      let masterViewList_TableData = masterViewListGetData.succesObject;
      this.userBaseFieldName = masterViewListGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.viewForm.patchValue( masterViewList_TableData);
      if(masterViewList_TableData.succesObject.requestTypeIsActive == '1'){
        this.viewForm.patchValue({requestTypeIsActive : true});
      }else{
        this.viewForm.patchValue({requestTypeIsActive : false});
      }
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    })
    this.componentLoaderService.display(false);
  }
  ngOnDestroy(){
    localStorage.removeItem('sublocationId');
  }

}

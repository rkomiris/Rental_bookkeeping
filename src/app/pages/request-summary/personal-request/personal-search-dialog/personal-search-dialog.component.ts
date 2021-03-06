import { Component, OnInit } from '@angular/core';
import { PersonalRequestService } from '../personal-request.service';
import { Router } from '@angular/router';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { RequestService } from 'src/app/pages/request/request.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-personal-search-dialog',
  templateUrl: './personal-search-dialog.component.html',
  styleUrls: ['./personal-search-dialog.component.css']
})
export class PersonalSearchDialogComponent implements OnInit {

  constructor(private appService: PersonalRequestService,
    private router: Router,
    private formBuilder: FormBuilder,
    private requestService: RequestService,
    private jsonApiService: JsonApiService) { }

  searchForm: any = [];
  qtd: any = [];
  qtm: any = '';
  searchCombo: any = [];
  desicionarr: any = [];
  statusArray: any = [];
  userRoleFieldName: any;
  displayNoRecords = true;
  count: number = 1;
  requestList: any = [];
  activeUrl: any;
  labels: any = {};

  ngOnInit() {
    this.request_list_details();
    this.getLabelDetails();
    this.activeUrl = this.router.url;
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()])
    });
  }
  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }
  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: ["", Validators.required],
      textVal: ["", Validators.required]
    });
  }

  request_list_details() {

    let resolver = localStorage.getItem('resolverActive');

    if (resolver !== 'active' && localStorage.getItem('langCode') == 'en') {
      this.searchCombo = [
        { name: 'Choose Field' },
        { name: 'Request Code', value: 'requestCode' },
        { name: 'Sub Type Name', value: 'requestSubTypeName' },
        { name: 'Request Date', value: 'requestDate' },
        { name: 'Request Subject', value: 'requestSubject' },
        { name: 'Request Priority', value: 'requestPriority' },
        { name: 'Request Status', value: 'currentStatusId' }];

      this.statusArray = [
        { name: 'Choose Field' },
        { name: 'Completed', value: '1' },
        { name: 'Pending', value: '2' },
        { name: 'Escalated', value: '3' },
        { name: 'New', value: '4' },
        { name: 'Approved', value: '5' },
        { name: 'Rejected', value: '6' },
        { name: 'Re-Submit', value: '7' },
        { name: 'In-Progress', value: '8' },
        { name: 'Re-Assign', value: '9' },
        { name: 'Reopen', value: '10' },
        { name: 'Closed', value: '11' },
        { name: 'Not-Working', value: '12' },
        { name: 'Cancelled', value: '13' },
        { name: 'Hold', value: '14' }];

    } 
    else if (resolver !== 'active' && localStorage.getItem('langCode') == 'jp') {
      this.searchCombo = [
        { name: '?????????????????????' },
        { name: '????????????????????????', value: 'requestCode' },
        { name: '?????????????????????????????????', value: 'requestSubTypeName' },
        { name: '??????????????????', value: 'requestDate' },
        { name: '?????????????????????', value: 'requestSubject' },
        { name: '????????????', value: 'requestPriority' },
        { name: '??????', value: 'currentStatusId' }];

      this.statusArray = [
        { name: '?????????????????????' },
        { name: '??????', value: '1' },
        { name: '?????????', value: '2' },
        { name: '???????????????????????????', value: '3' },
        { name: '?????????', value: '4' },
        { name: '??????', value: '5' },
        { name: '??????', value: '6' },
        { name: '?????????', value: '7' },
        { name: '?????????', value: '8' },
        { name: 'Re-???????????????????????????', value: '9' },
        { name: '????????????', value: '10' },
        { name: '??????????????????', value: '11' },
        { name: '????????????', value: '12' },
        { name: '???????????????', value: '13' },
        { name: '??????', value: '14' }];

    } 
    else if(resolver == 'active' && localStorage.getItem('langCode') == 'en') {
      this.searchCombo = [
        { name: 'Choose Field' },
        { name: 'Request Code', value: 'requestCode' },
        { name: 'Sub Type Name', value: 'requestSubTypeName' },
        { name: 'Request Date', value: 'requestDate' },
        { name: 'Subject', value: 'requestSubject' },
        { name: 'Priority', value: 'requestPriority' }];
    }
    else if(resolver == 'active' && localStorage.getItem('langCode') == 'jp') {
      this.searchCombo = [
        { name: '?????????????????????' },
        { name: '????????????????????????', value: 'requestCode' },
        { name: '?????????????????????????????????', value: 'requestSubTypeName' },
        { name: '??????????????????', value: 'requestDate' },
        { name: '????????????', value: 'requestSubject' },
        { name: '????????????', value: 'requestPriority' }];
    }

    if(localStorage.getItem('langCode') == 'en'){
      this.desicionarr = [
        { name: 'Low', value: '1' },
        { name: 'Medium', value: '2' },
        { name: 'High', value: '3' }];
    }else if(localStorage.getItem('langCode') == 'en'){
      this.desicionarr = [
        { name: '??????', value: '1' },
        { name: '???', value: '2' },
        { name: '??????', value: '3' }];
    }
  
  }

  changefield(val, ind, form) {
    form.controls.searchDatas.controls[ind].controls.textVal.reset();
    let kk = this.hasNoDuplicates(this.qtd);
    if (kk === true) {

    } else {
    this.qtd[ind] = {};
      form.controls.searchDatas.controls[ind].controls.dropDownVal.reset();
      form.controls.searchDatas.controls[ind].controls.textVal.reset();
    }
  }

  hasNoDuplicates(arr) {
    return arr.every(num => arr.indexOf(num) === arr.lastIndexOf(num));
  }



  removeFilter(filterValue: string) {
    this.displayNoRecords = true;
    if (filterValue == null) {
      this.request_list_details();
    }

  }

  dateClick(event) {
  }

  onSubmitSearch(val) {


    let finalSearchData = {};
    let formValue = val;

    for (let i = 0; i < formValue.searchDatas.length; i++) {
      let key = formValue.searchDatas[i]['dropDownVal'];
      let value = formValue.searchDatas[i]['textVal'];
      let fullValue = {}
      if (key != '' && value != '') {
        fullValue[key] = value;
        Object.assign(finalSearchData, fullValue);
      }
    }

    this.appService.searchRequest(finalSearchData).subscribe(data => {
      let reqScrConfigSearchData = JSON.parse(data['_body']);
      this.requestList = reqScrConfigSearchData.succesObject;


    });
  }

  addSequence(form) {
    let j = form.controls.searchDatas.controls.length;
    let i = j - 1;

    let dropvalue = form.controls.searchDatas.controls[i].controls.dropDownVal.value;
    let textVal = form.controls.searchDatas.controls[i].controls.textVal.value;

    if (this.count <= this.searchCombo.length - 2 && dropvalue !== null && textVal != null) {
      (
        this.searchForm.controls['searchDatas'] as FormArray).push(this.sequenceType());
      this.count++;
    }
  }


  deleteSequence() {
    if (this.count > 1) {
      (this.searchForm.controls["searchDatas"] as FormArray).removeAt(-1);
      this.count--;
      this.qtd.pop();
    }
  }

}


import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';

import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup, FormArray, NgControlStatus, Validators } from '@angular/forms';
import { WidgetsService } from '../widgets.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
// export const widgetArray:any={
// 	'widgetId': 1,
// 	'widgetCode': '45',
// 	'widgetIndex': 4,
// 	'widgetTitle': 'abi',
// //	'widgetIcon': 'icon',
// 	'widgetSeq': 23,
// 	'widgetIsActive': 'yes',
// 	'widgetsIdList': null,
// 	'widgetDetailVoList': [
// 		{
// 			'widgetDetailId': 1,
// 			'widgetDetailHeading': 'praba',
// 			'widgetDetailHeadingIndex': 2,
// 			'widgetDetailPicIsRequired': 'yes',
// 	//		'widgetDetailPicPath': 'praba',
// 			'widgetDetailDescription': 'praba',
// 			'widgetDetailAttIsRequired': 'yes',
// 		//	'widgetDetailAttPath': 'praba',
// 			'widgetDetailMorePath': 'praba',
// 			'widgetDetailExternalUrl': 'praba',
// 			'widgetDetailIsActive': 'yes',
// 			'widgetDetailAnnouncementDate': 1483660800000,
// 			'widgetDetailValidFrom': 1483920000000,
// 			'widgetDetailValidTo': 1484006400000,
// 			'widgetId': 1
//     },
//     {
// 			'widgetDetailId': 2,
// 			'widgetDetailHeading': 'praba2',
// 			'widgetDetailHeadingIndex': 1,
// 			'widgetDetailPicIsRequired': 'yes',
// 	//		'widgetDetailPicPath': 'praba',
// 			'widgetDetailDescription': 'praba2',
// 			'widgetDetailAttIsRequired': 'yes',
// 		//	'widgetDetailAttPath': 'praba',
// 			'widgetDetailMorePath': 'praba2',
// 			'widgetDetailExternalUrl': 'praba2',
// 			'widgetDetailIsActive': 'yes',
// 			'widgetDetailAnnouncementDate': 1483660800000,
// 			'widgetDetailValidFrom': 1483920000000,
// 			'widgetDetailValidTo': 1484006400000,
// 			'widgetId': 2
// 		}
// 	]
// };

@Component({
  selector: 'app-widgets-modify',
  templateUrl: './widgets-modify.component.html',
  // styleUrls: ['./widgets-modify.component.css'],
  styleUrls: ['./widgets-modify-srmav.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetsModifyComponent
  implements OnInit, AfterViewInit, OnDestroy {
  saveForm: FormGroup;
  count: any = 1;
  widgetsAddGetData: any = {};
  widgetDetailId: number;
  subsriptionlist: Subscription[] = [];
  dataSource: any = [];
  displayedColumns: any = [];
  initialSelection = [];
  allowMultiSelect = false;
  userBaseFieldName: any;
  selection = new SelectionModel<{}>(false, []);
  fromDate: any;
  toDate: any;
  widgetId: number;
  picName: any;
  attName: any;
    
  labels: any = {};/** LABEL CHANGES **/ 
  data: any;

  widgetsDropdown = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  widgetIconName: string;
  constructor(
    private componentLoaderService: ComponentLoaderService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private widgetsModifyService: WidgetsService,
    private jsonApiService: JsonApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.displayedColumns = [
      'select',
      'heading',
      'status',
      'announcementDate',
      'validFrom',
      'validTo'
    ];
    this.dataSource = new MatTableDataSource<{}>([]);
    this.saveForm = this.formBuilder.group({
      widgetDetailVoList: this.formBuilder.array([this.sequenceType()]), // For Row Add and Remove
      widgetId: [''],
      widgetCode: [''],
      widgetIndex: [''],
      widgetTitle: ['', Validators.required],
      widgetIcon: [''],
      widgetIsActive: ['']
    });
    if (localStorage.getItem('widgetId') !== null) {
      let index = localStorage.getItem('widgetId');
      this.loadModifyDetailsById(index);
    }
    this.picName = undefined;
    this.attName = undefined;
    this.getLabelDetails()

  }
  ngAfterViewInit() {
    this.cdr.markForCheck();
    // this.patchForm(widgetArray);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  sequenceType() {
    return this.formBuilder.group({
      widgetDetailId: [''],
      widgetDetailHeading: ['', Validators.required],
      widgetDetailPicPath: [''],
      widgetDetailDescription: ['', Validators.required],
      widgetDetailAttPath: [''],
      widgetDetailExternalUrl: [''],
      widgetDetailIsActive: [''],
      widgetDetailAnnouncementDate: [null, Validators.required],
      widgetDetailValidFrom: [null, Validators.required],
      widgetDetailValidTo: [null, Validators.required],
    });
  }
  /**** LABEL CHNAGES ****/
	getLabelDetails() {
		let lang;
		if(localStorage.getItem('langCode') !== null){
		  lang = localStorage.getItem('langCode');
		}
		this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
			this.labels = data;
		});
	}
  loadModifyDetailsById(id) {
    let widgetsModifySub = this.widgetsModifyService
      .getWidgetById(id)
      .subscribe(
        data => {
          let widgetData = JSON.parse(data['_body']);
          let listData = widgetData.succesObject;
          this.widgetId = listData.widgetId;
          this.widgetIconName = listData.widgetVo.widgetIcon;
          this.userBaseFieldName = widgetData.authSuccesObject.screenFieldDisplayVoList.map(
            element => {
              return element;
            }
          );
          this.patchForm(widgetData.succesObject.widgetVo);
          let tableList = widgetData.succesObject.widgetDetailVoList;
          this.dataSource = new MatTableDataSource(tableList);
          this.intializeDataTable();
          this.componentLoaderService.display(false);
        },
        error => {
          console.log(error);
        }
      );
    this.subsriptionlist.push(widgetsModifySub);
  }
  patchForm(data) {
    this.saveForm.patchValue({
      widgetIndex: data.widgetIndex,
      widgetTitle: data.widgetTitle,
      widgetId: data.widgetId,
      widgetCode: data.widgetCode,
      widgetIsActive: data.widgetIsActive
    });
  }
  widgetDetailVoList(data) {
    let control = this.saveForm.controls.widgetDetailVoList as FormArray;
    data.forEach(x => {
      control.push(
        this.formBuilder.group({
          widgetDetailHeading: x.widgetDetailHeading,
          widgetDetailPicPath: x.widgetDetailPicPath,
          widgetDetailDescription: x.widgetDetailDescription,
          widgetDetailAttPath: x.widgetDetailAttPath,
          widgetDetailExternalUrl: x.widgetDetailExternalUrl,
          widgetDetailIsActive: x.widgetDetailIsActive,
          widgetDetailAnnouncementDate: new Date(
            x.widgetDetailAnnouncementDate
          ),
          widgetDetailValidFrom: new Date(x.widgetDetailValidFrom),
          widgetDetailValidTo: new Date(x.widgetDetailValidTo)
        })
      );
    });
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  highlight(element: any) {
    element.highlighted = !element.highlighted;
  }
  onSubmit(event) {
    if (this.saveForm.valid) {
      this.componentLoaderService.display(true);
      let temp = this.removeFileObjects(this.saveForm.value);

      //let temp = this.saveForm.value;
      temp.screenFieldDisplayVoList = this.userBaseFieldName;
      if (temp.widgetDetailVoList[0].widgetDetailAnnouncementDate == 'Invalid date' && temp.widgetDetailVoList[0].widgetDetailValidFrom == 'Invalid date' && temp.widgetDetailVoList[0].widgetDetailValidTo == 'Invalid date') {
        temp.widgetDetailVoList = null;
      }
      let formData = new FormData();
      let action = JSON.stringify(temp);
      formData.append('action', action);
      if (
        this.saveForm.value.widgetIcon !== null &&
        this.saveForm.value.widgetIcon !== undefined &&
        this.saveForm.value.widgetIcon !== ''
      ) {
        let file1 = this.saveForm.value.widgetIcon.files[0];
        formData.append('file', file1);
      }
      if (
        this.saveForm.value.widgetDetailVoList[0].widgetDetailPicPath !==
        null &&
        this.saveForm.value.widgetDetailVoList[0].widgetDetailPicPath !==
        undefined &&
        this.saveForm.value.widgetDetailVoList[0].widgetDetailPicPath !== ''
      ) {
        for (let i = 0; i < this.saveForm.value.widgetDetailVoList[0].widgetDetailPicPath.files.length; i++) {
          let file2 = this.saveForm.value.widgetDetailVoList[0].widgetDetailPicPath.files[i];
          formData.append('file1', file2);
        }
      }
      if (
        this.saveForm.value.widgetDetailVoList[0].widgetDetailAttPath !==
        null &&
        this.saveForm.value.widgetDetailVoList[0].widgetDetailAttPath !==
        undefined &&
        this.saveForm.value.widgetDetailVoList[0].widgetDetailAttPath !== ''
      ) {
        for (let i = 0; i < this.saveForm.value.widgetDetailVoList[0].widgetDetailAttPath.files.length; i++) {
          let file3 = this.saveForm.value.widgetDetailVoList[0].widgetDetailAttPath.files[i];
          formData.append('file2', file3);
        }
      }
      this.widgetsModifyService.updateProjectList(formData).subscribe(
        data => {
          let Response = JSON.parse(data['_body']);
          if (Response.responseCode == '200') {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Info',
                server: 'servermessage',
                message: Response.responseMessage,
                btnYes: 'OK'
              }
            });
            this.router.navigate(['widgets']);
            // if (localStorage.getItem('widgetId') !== null) {
            //   let index = localStorage.getItem('widgetId');
            //   this.loadModifyDetailsById(index);
            //   let control = this.saveForm.get('widgetDetailVoList') as FormArray;
            //   control.controls = [];
            //   control.push(this.sequenceType());
            // }
          } else {
            const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Alert',
                server: 'servermessage',
                message: Response.responseMessage,
                btnYes: 'OK'
              }
            });
          }
          this.componentLoaderService.display(false);
        },
        error => {
          if (error.status === 401) {
          }
          console.log(error);
        }
      );
    } else {
    }
  }
  addSequence() {
    if (this.count <= 2) {
      (this.saveForm.controls['widgetDetailVoList'] as FormArray).push(
        this.sequenceType()
      );
      this.count++;
    }
  }

  deleteSequence() {
    if (this.count > 1) {
      (this.saveForm.controls['widgetDetailVoList'] as FormArray).removeAt(-1);
      this.count--;
    }
  }
  editRecord(event, row) {
    if (event.checked) {
      this.widgetDetailId = row.widgetDetailId;
      this.mappingRowObject(row);
    } else {
      let control = this.saveForm.get('widgetDetailVoList') as FormArray;
      control.controls = [];
      control.push(this.sequenceType());
      this.widgetDetailId = undefined;
      this.picName = undefined;
      this.attName = undefined;
    }
  }
  mappingRowObject(data) {
    this.data = data;
    if (data.widgetDetailPicPath !== null) {
      if (data.widgetDetailPicPath != null && data.widgetDetailPicPath.includes(',')) {
        this.picName = data.widgetDetailPicPath.split(",");
      }
      else if (data.widgetDetailPicPath != null && !data.widgetDetailPicPath.includes(',')) {
        this.picName = [data.widgetDetailPicPath];
      } else {
        this.picName = undefined;
      }
    }
    if (data.widgetDetailAttPath !== null) {
      if (data.widgetDetailAttPath != null && data.widgetDetailAttPath.includes(',')) {
        this.attName = data.widgetDetailAttPath.split(",");
      }
      else if (data.widgetDetailAttPath != null && !data.widgetDetailAttPath.includes(',')) {
        this.attName = [data.widgetDetailAttPath];
      } else {
        this.attName = undefined;
      }
    }

    let control = this.saveForm.get('widgetDetailVoList') as FormArray;
    let temp: any = {};
    for (let key in data) {
      if (key !== 'widgetDetailAttPath' && key !== 'widgetDetailPicPath' && key !== 'highlighted' && key !== 'hovered') {
        if (key == 'widgetDetailAnnouncementDate' || key == 'widgetDetailValidFrom' || key == 'widgetDetailValidTo') {
          temp[key] = new Date(data[key]);
        } else {
          temp[key] = data[key];
        }
      }
    }
    control.controls = [];
    control.push(this.loadsequenceType(temp));
  }
  //  key !== 'widgetDetailAttPath' && key !== 'widgetDetailPicPath' &&  
  loadsequenceType(data) {
    return this.formBuilder.group({
      widgetDetailId: [data.widgetDetailId],
      widgetDetailHeading: [data.widgetDetailHeading],
      widgetDetailPicPath: [data.widgetDetailPicPath],
      widgetDetailDescription: [data.widgetDetailDescription],
      widgetDetailAttPath: [data.widgetDetailAttPath],
      widgetDetailExternalUrl: [data.widgetDetailExternalUrl],
      widgetDetailIsActive: [data.widgetDetailIsActive],
      widgetDetailAnnouncementDate: [data.widgetDetailAnnouncementDate],
      widgetDetailValidFrom: [data.widgetDetailValidFrom],
      widgetDetailValidTo: [data.widgetDetailValidTo]
    });

  }
  attachmentDownload() {
    if (this.widgetDetailId != undefined) {
      this.widgetsModifyService.attDownload(this.widgetDetailId).subscribe(
        data => {
          let headers = data.headers;
          let contentType =
            headers.get("Content-type") || "application/octet-stream";
          let fileHeaders = headers.get("Content-Disposition");
          let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
          let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
          let filename = fileHeaders.substring(startIndex, endIndex);
          let urlCreator =
            window.URL ||
            (<any>window).webkitURL ||
            (<any>window).mozURL ||
            (<any>window).msURL;
          if (urlCreator) {
            let blob = new Blob([data["body"]], { type: contentType });
            let url = urlCreator.createObjectURL(blob);
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.style.display = "none";
            a.href = url;
            a.download = filename; // you may assign this value from header as well
            a.click();
            window.URL.revokeObjectURL(url);
          }
        },
        error => {
          if (error.status === 401) {
          }
          console.log(error);
        });
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'attachment',
          btnYes: 'OK'
        }
      });
    }
  }
  pictureDownload() {
    if (this.widgetDetailId != undefined) {
      this.widgetsModifyService.picDownload(this.widgetDetailId).subscribe(
        data => {
          let headers = data.headers;
          let contentType =
            headers.get("Content-type") || "application/octet-stream";
          let fileHeaders = headers.get("Content-Disposition");
          let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
          let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
          let filename = fileHeaders.substring(startIndex, endIndex);
          let urlCreator =
            window.URL ||
            (<any>window).webkitURL ||
            (<any>window).mozURL ||
            (<any>window).msURL;
          if (urlCreator) {
            let blob = new Blob([data["body"]], { type: contentType });
            let url = urlCreator.createObjectURL(blob);
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.style.display = "none";
            a.href = url;
            a.download = filename; // you may assign this value from header as well
            a.click();
            window.URL.revokeObjectURL(url);
          }
        },
        error => {
          if (error.status === 401) {
          }
          console.log(error);
        });
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'attachment',
          btnYes: 'OK'
        }
      });
    }
  }
  iconDownload() {
    localStorage.getItem('widgetId');
    this.widgetsModifyService.icoDownload(localStorage.getItem('widgetId')).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        let filename = fileHeaders.substring(startIndex, endIndex);
        let urlCreator =
          window.URL ||
          (<any>window).webkitURL ||
          (<any>window).mozURL ||
          (<any>window).msURL;
        if (urlCreator) {
          let blob = new Blob([data["body"]], { type: contentType });
          let url = urlCreator.createObjectURL(blob);
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.style.display = "none";
          a.href = url;
          a.download = filename; // you may assign this value from header as well
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });
  }
  // mappingObjects(data) {
  //   if (Object.keys(data).length > 0) {
  //     let temp = {};
  //     for (let key in data) {
  //       if (key == 'widgetIcon') {
  //         if (data[key] && data[key].files.length > 0) {
  //           temp[key] = data[key].files[0];
  //         } else {
  //           temp[key] = '';
  //         }
  //       } else if (key == 'widgetDetailVoList') {
  //         temp[key] = data[key].map(element => {
  //           let _temp = {};
  //           for (let _key in element) {
  //             if (_key == 'widgetDetailAttPath') {
  //               if (element[_key] && element[_key].files.length > 0) {
  //                 _temp[_key] = element[_key].files[0];
  //               } else {
  //                 _temp[_key] = '';
  //               }
  //             } else if (_key == 'widgetDetailPicPath') {
  //               if (element[_key] && element[_key].files.length > 0) {
  //                 _temp[_key] = element[_key].files[0];
  //               } else {
  //                 _temp[_key] = '';
  //               }
  //             } else {
  //               _temp[_key] = element[_key];
  //             }
  //           }
  //           return _temp;
  //         });
  //       } else {
  //         temp[key] = data[key];
  //       }
  //     }
  //     return temp;
  //   }
  //   return data;
  // }
  // createFormData(object: Object,form?: FormData, namespace?: string): FormData {
  //   const formData = form || new FormData();
  //   for (let property in object) {
  //     if (!object.hasOwnProperty(property) || !object[property]) {
  //       continue;
  //     }
  //     const formKey = namespace ? `${namespace}[${property}]` : property;
  //     if (object[property] instanceof Date) {
  //       formData.append(formKey, object[property].toISOString());
  //     } else if ( typeof object[property] === 'object' &&  !(object[property] instanceof File) ) {
  //       this.createFormData(object[property], formData, formKey);
  //     } else {
  //       formData.append(formKey, object[property]);
  //     }
  //   }
  //   return formData;
  // }
  removeFileObjects(data) {
    if (Object.keys(data).length > 0) {
      let temp = {};
      for (let key in data) {
        if (key !== 'widgetIcon' && key !== 'widgetDetailVoList') {
          temp[key] = data[key];
        }
        if (key == 'widgetDetailVoList') {
          temp[key] = this.mapwidgetDetailVoList(data[key]);
        }
      }
      return temp;
    }
    return data;
  }
  mapwidgetDetailVoList(data) {
    let temp = [];
    data.forEach(element => {
      let _temp = {};
      for (let key in element) {
        if (key !== 'widgetDetailPicPath' && key !== 'widgetDetailAttPath') {
          // _temp[key] = element[key];
          if (key == 'widgetDetailAnnouncementDate') {
            if (element[key] != null) {
              _temp[key] = moment(element[key]).format('YYYY-MM-DD');
            }
          } else if (key == 'widgetDetailValidFrom') {
            if (element[key] != null) {
              _temp[key] = moment(element[key]).format('YYYY-MM-DD');
            }
          } else if (key == 'widgetDetailValidTo') {
            if (element[key] != null) {
              _temp[key] = moment(element[key]).format('YYYY-MM-DD');
            }
          } else {
            _temp[key] = element[key];
          }
        }
      }
      temp.push(_temp);
    });
    return temp;
  }
  intializeDataTable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy() {
    this.subsriptionlist.forEach(subscription => {
      subscription.unsubscribe();
    });
    localStorage.removeItem('widgetId');
  }
  fromDateVal(eve) {
    console.log(eve);
    this.fromDate = eve.value;
  }
  toDateVal(eve) {
    console.log(eve)
    this.toDate = eve.value;
  }
  downloadWidgetIcon(widgetId) {
    this.widgetsModifyService.picDownloadWidgetIcon(widgetId).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        // let filename = fileHeaders.substring(startIndex, endIndex);
        let filename =  this.widgetIconName;
        let urlCreator =
          window.URL ||
          (<any>window).webkitURL ||
          (<any>window).mozURL ||
          (<any>window).msURL;
        if (urlCreator) {
          let blob = new Blob([data["body"]], { type: contentType });
          let url = urlCreator.createObjectURL(blob);
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.style.display = "none";
          a.href = url;
          a.download = filename; // you may assign this value from header as well
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });

  }

  downloadpic(widgetDetailId) {
    this.widgetsModifyService.picDownloadFn(widgetDetailId).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        let filename = fileHeaders.substring(startIndex, endIndex);
        // let filename = "attachmentPicture." + data.body.type
        let urlCreator =
          window.URL ||
          (<any>window).webkitURL ||
          (<any>window).mozURL ||
          (<any>window).msURL;
        if (urlCreator) {
          let blob = new Blob([data["body"]], { type: contentType });
          let url = urlCreator.createObjectURL(blob);
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.style.display = "none";
          a.href = url;
          a.download = filename; // you may assign this value from header as well
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });

  }

  downloadAttpic(widgetDetailId) {
    this.widgetsModifyService.attDownloadFn(widgetDetailId).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        // let filename = fileHeaders.substring(startIndex, endIndex);
        // let filename = "attachmentDownload.zip";
        let filename = "attachmentPicture." + data.body.type
        let urlCreator =
          window.URL ||
          (<any>window).webkitURL ||
          (<any>window).mozURL ||
          (<any>window).msURL;
        if (urlCreator) {
          let blob = new Blob([data["body"]], { type: contentType });
          let url = urlCreator.createObjectURL(blob);
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.style.display = "none";
          a.href = url;
          a.download = filename; // you may assign this value from header as well
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });

  }

  downloadindpic(widgetDetailId, picName) {
    this.widgetsModifyService.indiviudalpicDownloadFn(widgetDetailId, picName).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        // let filename = fileHeaders.substring(startIndex, endIndex);
        let filename = picName;
        let urlCreator =
          window.URL ||
          (<any>window).webkitURL ||
          (<any>window).mozURL ||
          (<any>window).msURL;
        if (urlCreator) {
          let blob = new Blob([data["body"]], { type: contentType });
          let url = urlCreator.createObjectURL(blob);
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.style.display = "none";
          a.href = url;
          a.download = filename; // you may assign this value from header as well
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });

  }
  
  downloadindAttpic(widgetDetailId, picName) {
    this.widgetsModifyService.indiviudalattDownloadFn(widgetDetailId, picName).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        // let filename = fileHeaders.substring(startIndex, endIndex);
        let filename = picName;
        let urlCreator =
          window.URL ||
          (<any>window).webkitURL ||
          (<any>window).mozURL ||
          (<any>window).msURL;
        if (urlCreator) {
          let blob = new Blob([data["body"]], { type: contentType });
          let url = urlCreator.createObjectURL(blob);
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.style.display = "none";
          a.href = url;
          a.download = filename; // you may assign this value from header as well
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });

  }

  form(form) {
    if (this.widgetIconName !== form.widgetIcon.fileNames) {
      this.widgetIconName = '';
    }
    if (form.widgetIcon.fileNames === '') {
      form.widgetIcon.fileNames = this.widgetIconName;
      this.widgetIconName = '';
    }

  }

  picForm(form) {
    // if(form.widgetDetailVoList[0].widgetDetailPicPath == null){
    //   form.widgetDetailVoList[0].widgetDetailPicPath = this.picName;
    // }
    if (this.picName.length == 1) {
      if (form.widgetDetailVoList[0].widgetDetailPicPath !== this.picName) {
        this.picName = undefined;
      }
    } else if (this.picName.length > 1) {
      this.picName = undefined;
    }
  }

  attForm(form) {

    if (this.attName.length == 1) {
      if (form.widgetDetailVoList[0].widgetDetailAttPath !== this.attName) {
        this.attName = undefined;
      }
    }
    else if (this.attName.length > 1) {
      this.attName = undefined;
    }
  }

}

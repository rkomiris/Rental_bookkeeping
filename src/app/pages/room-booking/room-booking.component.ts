
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, Inject, OnDestroy, Renderer } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { RoomBookingService } from './room-booking.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';
import { RoombookDetailComponent } from './roombook-detail/roombook-detail.component';
import * as moment from 'moment';
import { APP_DATE_FORMATS, AppDateAdapter } from '../../shared/data.format';
import { toDate } from '@angular/common/src/i18n/format_date';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    // dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


export interface roomBookListData {
  // highlighted?: boolean;
  // hovered?: boolean;
  id: number;
}

const ELEMENT_DATA: roomBookListData[] = [];


@Component({
  selector: 'app-room-booking',
  templateUrl: './room-booking.component.html',
  // styleUrls: ['./room-booking.component.css'],
  styleUrls: ['./room-booking-srmav.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    // { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class RoomBookingComponent implements OnInit {
  selectedItem: any;
  saveForm: FormGroup;
  locationForm : FormGroup;
  public from_MinDate = new Date();
  today: Date = new Date();
  totalRooms: any = [];
  roomFacilities: any = [];
  selectedTopics = [];
  scheduleList = [];
  calendarOptions: OptionsInput;
  eventsModel: any;
 priorityCombo = [
    { id: 1, Value: 'Low' },
    { id: 2, Value: 'Medium' },
    { id: 3, Value: 'High' }
  ];
  addUpdateFlag : boolean = true;
  mycheck = false;
  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  checklist: any;
  subLocationId: any;
  locationVal;
  subLocation_data: any;
  subLocationName_data: any;
  RB_selectFormGetDate: any = {};
  sublocationVal;
  roomConfig_data: any;
  roomConfigName_data: any;
  RB_location_selectFormGetData: any = [];
  roomConfigVal;
  fullcalendarSearch_data: any;
  fullcalendarSearchName_data: any;
  fullcalendar_ListData: any;
  newRoomGetData: any = {};
  roomBookingId: number;
  eventModifyListGetData: any = {};
  checkEventDays: boolean = true;
  locationFilter: any;
  sublocationFilter : any;
  constructor(private componentLoaderService : ComponentLoaderService, @Inject(DOCUMENT) private document: Document, private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog, private roomBookingService: RoomBookingService) {
    this.checklist = [
      { id: 1, value: 'SUN', isSelected: false },
      { id: 2, value: 'MON', isSelected: true },
      { id: 3, value: 'TUE', isSelected: true },
      { id: 4, value: 'WED', isSelected: false },
      { id: 5, value: 'THU', isSelected: false },
      { id: 6, value: 'FRI', isSelected: false },
      { id: 7, value: 'SAT', isSelected: false },
    ];
    this.scheduleList = [{
      id: 1, value: 'Day Schedule', isSelected: false
    },
    {
      id: 1, value: 'Month Schedule', isSelected: false
    }];
  }

  onChange(value: any, checked: boolean) {
    console.log(value, checked);
    if (checked) {
      this.selectedTopics.push(value['id']);
    } else {
      let index = this.selectedTopics.indexOf(value);
      this.selectedTopics.splice(index, 1);
    }
    console.log(this.selectedTopics)
  }
  checkmy(ev) {
  console.log(ev);
  if ( ev === false) {
   this.mycheck = false;
   this.selectedTopics = [];
  } else {
    this.mycheck = true;
  }
  }
  onChangechecked(checked) {
  console.log(checked);
  console.log(this.checklist);
  if (checked === false) {
    this.selectedTopics = [];
    this.checklist = [ { id: 1, value: 'SUN', isSelected: false },
    { id: 2, value: 'MON', isSelected: false },
    { id: 3, value: 'TUE', isSelected: false },
    { id: 4, value: 'WED', isSelected: false },
    { id: 5, value: 'THU', isSelected: false },
    { id: 6, value: 'FRI', isSelected: false },
    { id: 7, value: 'SAT', isSelected: false },];
  }
  }
  isSelected(value: any): boolean {
    return this.selectedTopics.indexOf(value.id) >= 0;
  }



  ngOnInit() {
    this.componentLoaderService.display(true);
    this.locationForm = this.formBuilder.group({
      id: [''],
      sublocationId: [''],
    });
    this.saveForm = this.formBuilder.group({
      roomBookingFromDate: ["", Validators.required],
      roomBookingToDate: ["", Validators.required],
      roomBookingFromTime: ['',],
      roomBookingToTime: ['',],
      isRoomBookingCancel: [false],
      isRoomBookingRecursive: [false],
      roomBookingRecursiveSeq: [''],
      roomBookingSubject: ['', Validators.required],
      roomBookingNoOfSeats: ['',],
      roomBookingPriority: [0],
      // roomBookingWorkflowSeq : [0],
      // roomBookingCode: [''],
      roomConfigId: [''],
      id: [''],
      sublocationId: [''],
      // departmentId: [''],
      day: [''],
      roomBookingDetailsId : [],
      roomBookingDetailsVo : [],
      // departmentId : []
    });
    this.saveForm.disable();
    this.onload_RoomBookList_Data();
    this.onloadSelectboxData();
    if(localStorage.getItem('locationId') || localStorage.getItem('subLocationId')){
      this.locationVal = localStorage.getItem('locationId');
      this.subLocationId = localStorage.getItem('subLocationId');
      this.onloadSelected_LocationType(this.locationVal, this.subLocationId);
      if(localStorage.getItem('subLocationId')){
        this.onLoadselected_SubLocationType(localStorage.getItem('subLocationId'), this.locationVal)
      }
      this.fullcalendar_loadData(localStorage.getItem('locationId'), localStorage.getItem('subLocationId'));
    }else{
      this.fullcalendar_loadData(undefined, undefined);
    }
    this.locationVal = localStorage.getItem('locationId');
    this.subLocationId = localStorage.getItem('subLocationId');
  }
  onload_RoomBookList_Data() {
    this.totalRooms = [];
    let loadSelectBoxList = this.roomBookingService.load_roomBookList_Data().subscribe(data => {
      let RB_selectGetData = JSON.parse(data['_body']);
      for (let i = 0; i < RB_selectGetData.succesObject.length; i++) {
        this.totalRooms.push({ name: RB_selectGetData.succesObject[i].roomConfigRoomName + ' - ' + RB_selectGetData.succesObject[i].roomConfigCode, roomConfigId: RB_selectGetData.succesObject[i].roomConfigId });
      }
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    })
  }
  onSelect(i, newValue) {
    this.selectedItem = newValue;
    let loadFacilitiesList = this.roomBookingService.loadFacilities_Data(i).subscribe(data => {
      let RB_selectGetData = JSON.parse(data['_body']);
      let formData = RB_selectGetData.succesObject;
      this.roomFacilities = RB_selectGetData.succesObject.rinRoomDetailConfigVoList;
      // if(RB_selectGetData.succesObject.rinRoomDetailConfigVoList != null && RB_selectGetData.succesObject.rinRoomDetailConfigVoList.length > 0){}
      this.saveForm.enable();
      this.saveForm.patchValue(formData);
      this.saveForm.patchValue({ roomBookingNoOfSeats: formData.roomConfigNoOfSeats });

    }, error => {
      if (error.status === 401) {
        alert(error);
      }
    });
  }
  onloadSelectboxData() {
    let loadSelectBoxList = this.roomBookingService.load_selectBoxData().subscribe(data => {
      let RB_locationSelectData = JSON.parse(data['_body']);
      this.RB_location_selectFormGetData = RB_locationSelectData.succesObject;
      this.locationVal = Number(localStorage.getItem('locationId'));
      this.subLocationId = Number(localStorage.getItem('subLocationId'));
      setTimeout(() => {
        console.log(this.locationVal);
        console.log(this.locationForm.value)
      }, 5000);
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    })

  }
  onloadSelected_LocationType(event, subLocationId) {
    this.roomConfigName_data = [];
    this.roomBookingService.load_selectBox_subLocationData(event).subscribe(data => {
      this.subLocation_data = JSON.parse(data['_body']);
      this.subLocationName_data = this.subLocation_data.succesObject;
      let location = { id: event, subLocationId : subLocationId};
      let loadSelectBoxList = this.roomBookingService.load_roomBookList_DataLocation(location).subscribe(data => {
        let RB_selectGetData = JSON.parse(data['_body']);
        this.totalRooms = [];
        for (let i = 0; i < RB_selectGetData.succesObject.length; i++) {
          this.totalRooms.push({ name: RB_selectGetData.succesObject[i].roomConfigRoomName + ' - ' + RB_selectGetData.succesObject[i].roomConfigCode, roomConfigId: RB_selectGetData.succesObject[i].roomConfigId });
        }
      }, error => {
        if (error.status === 401) {
          alert("Error");
        }
      });
    });
    
      this.locationForm.patchValue({id : Number(this.locationVal)})
      console.log(this.locationForm.value);
    }
  selected_LocationType(event) {
    this.locationVal = event;
    this.roomConfigName_data = [];
    this.roomBookingService.load_selectBox_subLocationData(this.locationVal).subscribe(data => {
      this.subLocation_data = JSON.parse(data['_body']);
      this.subLocationName_data = this.subLocation_data.succesObject;
      let location = { id: event };
      let loadSelectBoxList = this.roomBookingService.load_roomBookList_DataLocation(location).subscribe(data => {
        let RB_selectGetData = JSON.parse(data['_body']);
        this.totalRooms = [];
        for (let i = 0; i < RB_selectGetData.succesObject.length; i++) {
          this.totalRooms.push({ name: RB_selectGetData.succesObject[i].roomConfigRoomName + ' - ' + RB_selectGetData.succesObject[i].roomConfigCode, roomConfigId: RB_selectGetData.succesObject[i].roomConfigId });
        }
      }, error => {
        if (error.status === 401) {
          alert("Error");
        }
      })
      // let subLocationTypeId = 10;
      // this.roomBookingService.load_selectBox_roomConfigData(subLocationTypeId).subscribe(data => {
      //   this.roomConfig_data = JSON.parse(data['_body']);
      // });

    });
    localStorage.setItem('locationId', this.locationVal);
    localStorage.removeItem('subLocationId');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/room-booking']));
  }
  onLoadselected_SubLocationType(event, id) {
console.log('vvv')
    let location = { id: id, sublocationId: event };
    localStorage.setItem('subLocationId', this.subLocationId);
    let loadSelectBoxList = this.roomBookingService.load_roomBookList_DataLocation(location).subscribe(data => {
      let RB_selectGetData = JSON.parse(data['_body']);
      this.totalRooms = [];
      for (let i = 0; i < RB_selectGetData.succesObject.length; i++) {
        this.totalRooms.push({ name: RB_selectGetData.succesObject[i].roomConfigRoomName + ' - ' + RB_selectGetData.succesObject[i].roomConfigCode, roomConfigId: RB_selectGetData.succesObject[i].roomConfigId });
      }
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    })
    this.locationForm.patchValue({subLocationId : Number(this.subLocationId)})
    console.log(this.locationForm.value);
    // this.roomBookingService.load_selectBox_roomConfigData(this.sublocationVal).subscribe(data => {
    //   this.roomConfig_data = JSON.parse(data['_body']);
    //   this.roomConfigName_data = this.roomConfig_data.successObject;
    //   console.log(this.roomConfigName_data, 'RoomConfig Selected data----')

    // })
  }
  selected_SubLocationType(event, id) {
    console.log('vvv')
    let location = { id: id, sublocationId: event };
    this.subLocationId = event;
    localStorage.setItem('subLocationId', this.subLocationId);
    let loadSelectBoxList = this.roomBookingService.load_roomBookList_DataLocation(location).subscribe(data => {
      let RB_selectGetData = JSON.parse(data['_body']);
      this.totalRooms = [];
      for (let i = 0; i < RB_selectGetData.succesObject.length; i++) {
        this.totalRooms.push({ name: RB_selectGetData.succesObject[i].roomConfigRoomName + ' - ' + RB_selectGetData.succesObject[i].roomConfigCode, roomConfigId: RB_selectGetData.succesObject[i].roomConfigId });
      }
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    })
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/room-booking']));
    // this.roomBookingService.load_selectBox_roomConfigData(this.sublocationVal).subscribe(data => {
    //   this.roomConfig_data = JSON.parse(data['_body']);
    //   this.roomConfigName_data = this.roomConfig_data.successObject;
    //   console.log(this.roomConfigName_data, 'RoomConfig Selected data----')

    // })
  }
  selected_fullCalendarType(event) {
    this.roomConfigVal = event;
    this.roomBookingService.fullcalendar_search_Data(this.roomConfigVal).subscribe(data => {
      this.fullcalendarSearch_data = JSON.parse(data['_body']);
      this.fullcalendarSearchName_data = this.fullcalendarSearch_data.succesObject;
      let eventValue = [];
      for (let k = 0; k < this.fullcalendarSearchName_data.length; k++) {
        let val =
        {
          title: this.fullcalendarSearchName_data[k].roomBookingSubject,
          start: moment(this.fullcalendarSearchName_data[k].roomBookingFromDate).format('YYYY-MM-DD'),
          end: moment(this.fullcalendarSearchName_data[k].roomBookingToDate).format('YYYY-MM-DD'),
        }
        eventValue.push(val);
      }
      this.calendarOptions = {
        editable: true,
        selectable: false,
        eventLimit: true,
        header: {
          left: 'today',
          center: 'prev, title, next',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        allDaySlot: false,
        views: {
          week: {
            eventLimit: 2,
          },
        },
        events: eventValue,
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin]
      }
      console.log(eventValue)
    });

  }
  fullcalendar_loadData(location, subLocation) {
    this.roomBookingService.load_fullcalendar_Data({id: location, sublocationId: subLocation}).subscribe(data => {
      let fullcalendar_data = JSON.parse(data['_body']);
      this.fullcalendar_ListData = fullcalendar_data.succesObject;
      let eventValue = [];
      for (let k = 0; k < this.fullcalendar_ListData.length; k++) {
        console.log(this.fullcalendar_ListData[k]);
        if (this.fullcalendar_ListData[k] !== undefined && this.fullcalendar_ListData[k].roomBookingDetailsVo !== undefined) {
        let val =
        {
          title: this.fullcalendar_ListData[k].roomBookingDetailsVo.roomBookingSubject,
          start: moment(this.fullcalendar_ListData[k].roomBookingDetailsVo.roomBookingFromDate).format('YYYY-MM-DD'),
          end: moment(this.fullcalendar_ListData[k].roomBookingDetailsVo.roomBookingToDate).format('YYYY-MM-DD'),
          from: this.fullcalendar_ListData[k].roomBookingDetailsVo.roomBookingFromTime,
          to: this.fullcalendar_ListData[k].roomBookingDetailsVo.roomBookingToTime,
          roomBookingDetailsId: this.fullcalendar_ListData[k].roomBookingDetailsVo.roomBookingDetailsId,
          roomBookingId : this.fullcalendar_ListData[k].roomBookingDetailsVo.roomBookingId,
          roomConfigRoomName: this.fullcalendar_ListData[k].roomBookingConfigVo.roomConfigRoomName,
          isRoomBookingRecursive: this.fullcalendar_ListData[k].isRoomBookingRecursive,
          isRoomConfigApprovalRequired : this.fullcalendar_ListData[k].rinRoomConfigVo.isRoomConfigApprovalRequired,
          currentStatusName : this.fullcalendar_ListData[k].currentStatusName,
          userId : this.fullcalendar_ListData[k].userId
        }
        eventValue.push(val);
      }
      }
     for(let j=0; j < eventValue.length; j++){
       if(eventValue[j].isRoomBookingRecursive === false){
         if(eventValue[j].start != eventValue[j].end){
          let endDate = new Date(eventValue[j].end);
          endDate.setDate(endDate.getDate() + 1);
          eventValue[j].end = new Date(endDate).toISOString().split('T')[0];
         }
       }
     }
     console.log(eventValue)
      this.calendarOptions = {
        editable: true,
        selectable: false,
        eventLimit: true,
        header: {
          left: 'today',
          center: 'prev, title, next',
          right: 'dayGridMonth,dayGridDay'
        },
        allDaySlot: false,
        views: {
          week: {
            eventLimit: 2,
          },
        },

        events: eventValue,
        defaultView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin]
      }
      this.componentLoaderService.display(false);
    });
    // this.componentLoaderService.display(false);
  }
  newRoom_creation(tempData): void {
    this.roomBookingService.add_newRoom_booking(tempData).subscribe(data => {
      let newRoom_add_data = JSON.parse(data['_body']);
    },
      error => {
        if (error.status === 401) {
          alert("Error");
        }
      })

  }
  eventClick(eventInfo) {
    console.log("event Click", eventInfo.event);
    let end;
    if (eventInfo.event.end === null) {
      end = moment(eventInfo.event.start).format('YYYY-MM-DD');
    } else if(eventInfo.event.start != eventInfo.event.end){
      end = moment(eventInfo.event.end).format('YYYY-MM-DD');
      let date1 = new Date(end);
      date1.setDate(date1.getDate() - 1);
      end = new Date(date1).toISOString().split('T')[0];
    }
    this.checkEventDays = false;
    const dialogRef = this.dialog.open(RoombookDetailComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: 'auto',
      data: {
        title: eventInfo.event.title,
        start: moment(eventInfo.event.start).format('YYYY-MM-DD'),
        end: end,
        time: eventInfo.event._def.extendedProps,
        btnNo: 'No',
        btnYes: 'Cancel Booking',
        btn: 'Cancel Current',
        modifyBtn : 'Modify',
        roomBookingDetailsId: eventInfo.event._def.extendedProps.roomBookingDetailsId,
        roomBookingId : eventInfo.event._def.extendedProps.roomBookingId,
        roomConfigRoomName : eventInfo.event._def.extendedProps.roomConfigRoomName,
        isRoomBookingRecursive : eventInfo.event._def.extendedProps.isRoomBookingRecursive,
        isRoomConfigApprovalRequired: eventInfo.event._def.extendedProps.isRoomConfigApprovalRequired,
        currentStatusName : eventInfo.event._def.extendedProps.currentStatusName,
        userId : eventInfo.event._def.extendedProps.userId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.checkEventDays = true;
      if (result && localStorage.getItem('cancelAllroomBookingId')) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Confirmation',
            message: "Are you sure you want to Cancel?",
            btnYes: 'Yes',
            btnNo: 'No',
          }
        });
        dialogRef.afterClosed().subscribe(data => {
          if (data) {
            this.roomBookingService.deleteAllEventList(Number(localStorage.getItem('cancelAllroomBookingId'))).subscribe(data => {
              let deleteEventData = JSON.parse(data['_body']);
              if (deleteEventData.responseCode == '200') {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  panelClass: 'btnCenter',
                  width: 'auto',
                  data: {
                    title: 'Info',
                    message: deleteEventData.responseMessage,
                    btnYes: 'OK',
                  }
                });
                dialogRef.afterClosed().subscribe(data => {
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/room-booking']));
                  localStorage.removeItem('cancelAllroomBookingId');
                })
              } else {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  panelClass: 'btnCenter',
                  width: 'auto',
                  data: {
                    title: 'Alert',
                    message: deleteEventData.responseMessage,
                    btnYes: 'OK',
                  }
                });
              }


            },
              error => {
                if (error.status === 401) {
                }
              });
          }else{
            localStorage.removeItem('cancelAllroomBookingId');
          }
        });
      }else if (result && localStorage.getItem('roomBookingDetailsId')) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Confirmation',
            message: "Are you sure you want to Cancel?",
            btnYes: 'Yes',
            btnNo: 'No',
          }
        });
        dialogRef.afterClosed().subscribe(data => {
          if (data) {
            this.roomBookingService.deleteEventList(Number(localStorage.getItem('roomBookingDetailsId'))).subscribe(data => {
              let deleteEventData = JSON.parse(data['_body']);
              if (deleteEventData.responseCode == '200') {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  panelClass: 'btnCenter',
                  width: 'auto',
                  data: {
                    title: 'Info',
                    message: deleteEventData.responseMessage,
                    btnYes: 'OK',
                  }
                });
                dialogRef.afterClosed().subscribe(data => {
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/room-booking']));
                  localStorage.removeItem('roomBookingDetailsId');
                })
              } else {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  panelClass: 'btnCenter',
                  width: 'auto',
                  data: {
                    title: 'Alert',
                    message: deleteEventData.responseMessage,
                    btnYes: 'OK',
                  }
                });
              }


            },
              error => {
                if (error.status === 401) {
                }
              });
          }else{
            localStorage.removeItem('roomBookingDetailsId');
          }
        });
      }else if(result && localStorage.getItem('modifyroomBookingDetailsId')){
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Confirmation',
            message: "Are you sure you want to modify?",
            btnYes: 'Yes',
            btnNo: 'No',
          }
        });

        dialogRef.afterClosed().subscribe(data => {
          if (data) {
            this.roomBookingService.viewEvent(Number(localStorage.getItem('modifyroomBookingDetailsId'))).subscribe(data => {
              let viewtData = JSON.parse(data['_body']);
              if (viewtData.responseCode == '200') {
                this.saveForm.enable();
                this.saveForm.patchValue(viewtData.succesObject.roomBookingDetailsVo);
                let fromDate = new Date(viewtData.succesObject.roomBookingDetailsVo.roomBookingFromDate).toISOString().split('T')[0];
                let toDate = new Date(viewtData.succesObject.roomBookingDetailsVo.roomBookingToDate).toISOString().split('T')[0];
                let partialFromFullDate = new Date(viewtData.succesObject.roomBookingDetailsVo.roomBookingFromFullDate).toISOString().split('T')[0];
                let partialToFullDate = new Date(viewtData.succesObject.roomBookingDetailsVo.roomBookingToFullDate).toISOString().split('T')[0];
                let date1 = new Date(fromDate);
                date1.setDate(date1.getDate() + 1);
                fromDate = new Date(date1).toISOString().split('T')[0];
                let date2 = new Date(toDate);
                date2.setDate(date2.getDate() + 1);
                toDate = new Date(date2).toISOString().split('T')[0];
                let fullFromDate = viewtData.succesObject.roomBookingDetailsVo.roomBookingFromFullDate.replace(partialFromFullDate, fromDate);
                let fullToDate =   viewtData.succesObject.roomBookingDetailsVo.roomBookingToFullDate.replace(partialToFullDate, toDate);
                let roomPriority = viewtData.succesObject.roomBookingPriority;
                console.log("room priority",roomPriority);
                this.saveForm.patchValue({roomBookingFromDate : fullFromDate, roomBookingToDate : fullToDate, roomBookingPriority : roomPriority});
                this.addUpdateFlag = false;
                console.log("form save", this.saveForm);
                // dialogRef.afterClosed().subscribe(data => {
                //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/room-booking']));
                //   localStorage.removeItem('modifyroomBookingDetailsId');
                // })
              } else {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  panelClass: 'btnCenter',
                  width: 'auto',
                  data: {
                    title: 'Alert',
                    message: viewtData.responseMessage,
                    btnYes: 'OK',
                  }
                });
              }


            },
              error => {
                if (error.status === 401) {
                }
              });
          }
        });
      }
    });
  }
  fullcalendar_event_modify() {
    this.roomBookingService.load_modify_eventData(localStorage.getItem('roomBookingId')).subscribe(data => {
      let eventModifyListGetData = JSON.parse(data['_body']);
      this.saveForm.enable();
      this.saveForm.patchValue(eventModifyListGetData.succesObject);
      console.log("save form", this.saveForm);
      // let eventModifyList_CallendarData = eventModifyListGetData.succesObject;
      // this.newRoomGetData.roomBookingFromDate = new Date(eventModifyList_CallendarData.roomBookingFromDate);
      // this.newRoomGetData.roomBookingToDate = new Date(eventModifyList_CallendarData.roomBookingToDate);
      // this.newRoomGetData.roomBookingFromTime = eventModifyList_CallendarData.roomBookingFromTime;
      // this.newRoomGetData.roomBookingToTime = eventModifyList_CallendarData.roomBookingToTime;
      // this.newRoomGetData.roomBookingNoOfSeats = eventModifyList_CallendarData.roomBookingNoOfSeats;
      // this.newRoomGetData.roomBookingSubject = eventModifyList_CallendarData.roomBookingSubject;
      // this.newRoomGetData.isRoomBookingRecursive = eventModifyList_CallendarData.isRoomBookingRecursive;
      // this.checkModifiedDates(eventModifyList_CallendarData);
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    })
  }


  checkModifiedDates(data) {
    this.selectedTopics = [];
    if (Object.keys(data).length > 0) {
      for (let key in data) {
        if (key == 'arrayOfDays0' && data[key]) {
          this.selectedTopics.push(1);
        }
        if (key == 'arrayOfDays1' && data[key]) {
          this.selectedTopics.push(2);
        }
        if (key == 'arrayOfDays2' && data[key]) {
          this.selectedTopics.push(3);
        }
        if (key == 'arrayOfDays3' && data[key]) {
          this.selectedTopics.push(4);
        }
        if (key == 'arrayOfDays4' && data[key]) {
          this.selectedTopics.push(5);
        }
        if (key == 'arrayOfDays5' && data[key]) {
          this.selectedTopics.push(6);
        }
        if (key == 'arrayOfDays6' && data[key]) {
          this.selectedTopics.push(7);
        }
      }
    }
  }








  deleteEventData: any = [];

  deleteEvent() {
    let tempDelEvent = localStorage.getItem('roomBookingIdList');
    this.roomBookingService.deleteEventList(tempDelEvent).subscribe(data => {
      let deleteEventData = JSON.parse(data['_body']);
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: "Are you sure? Cancel",
          btnYes: 'Yes',
          btnNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/room-booking']));
      })

    },
      error => {
        if (error.status === 401) {
        }
      })
  }




  onSubmit() {
    if (this.saveForm.valid) {
      this.saveForm.value.day = this.selectedTopics;
      this.saveForm.value.roomBookingRecursiveSeq = undefined;
      let fromDate = this.saveForm.value.roomBookingFromDate;
      let toDate = this.saveForm.value.roomBookingToDate;
      this.saveForm.value.roomBookingFromDate = new Date(this.saveForm.value.roomBookingFromDate).toISOString().split('T')[0];
      this.saveForm.value.roomBookingToDate = new Date(this.saveForm.value.roomBookingToDate).toISOString().split('T')[0];
      this.saveForm.value.roomBookingFromTime = moment(fromDate).format('hh:mm A');
      this.saveForm.value.roomBookingToTime = moment(toDate).format('hh:mm A');
      this.saveForm.value.roomBookingDetailsVo = {roomBookingFromFullDate : fromDate, roomBookingToFullDate : toDate };
      if(this.addUpdateFlag === true){
      this.roomBookingService.add_newRoom_booking(this.saveForm.value).subscribe(data => {
        let Response = JSON.parse(data['_body']);
        if (Response.responseCode == '200') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/room-booking']));
          })
        } else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
        }
      },
        error => {
          if (error.status === 401) {
            alert(error);
          }
        })
      }else{
        this.saveForm.value.roomBookingDetailsVo = undefined;
        this.saveForm.value.day = undefined;
        this.saveForm.value.isRoomBookingCancel = undefined;
        this.saveForm.value.isRoomBookingRecursive = undefined;
        this.saveForm.value.roomBookingFromFullDate = fromDate;
        this.saveForm.value.roomBookingToFullDate = toDate;
        this.saveForm.value.roomBookingId = Number(localStorage.getItem('roomBookingId'));
        this.roomBookingService.update_newRoom_booking(this.saveForm.value).subscribe(data => {
          let Response = JSON.parse(data['_body']);
          if (Response.responseCode == '200') {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Info',
                message: Response.responseMessage,
                btnYes: 'OK',
              }
            });
            dialogRef.afterClosed().subscribe(data => {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/room-booking']));
            })
          } else {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Alert',
                message: Response.responseMessage,
                btnYes: 'OK',
              }
            });
          }
        },
          error => {
            if (error.status === 401) {
              alert(error);
            }
          })
      }
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: "Please fill all mandatory Fields",
          btnYes: 'OK',
        }
      });
    }
  }






  // onSubmit(event) {

  //   this.roomBookingService.add_newRoom_booking(event).subscribe(data => {
  //     console.log(data, "add valuee----")
  //     let Response = JSON.parse(data['_body']);
  //     console.log(Response.statusMessage, "Messagessssssssss")
  //     if (Response.statusMessage === "Successfully Processed....") {
  //       console.log(data, "Added next valuee=====")
  //       const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //         disableClose: false,
  //         panelClass: 'btnCenter',
  //         width: 'auto',
  //         data: {
  //           message: "Successfully created",
  //           btnYes: 'OK',
  //         }
  //       });
  //       dialogRef.afterClosed().subscribe(data => {
  //         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/room-booking']));
  //       })
  //     }
  //   },
  //     error => {
  //       if (error.status === 401) {
  //         //alert("Error");
  //       }
  //     })

  // }

  clickButton(eve, id) {
    console.log(eve, id);
    let buttonType = eve.buttonType;
    let finalData;
    if (buttonType == "timeGridDay" || buttonType == "dayGridMonth") {
      if (buttonType == "timeGridDay") {
        let roomBookingDate = moment(eve.data).format('YYYY-MM-DD');
        finalData = { "id": id, "schedule": "1", "roomBookingDate": roomBookingDate }
      } else if (buttonType == "dayGridMonth") {
        let roomBookingDate = moment(eve.data).format('YYYY-MM-DD');
        let date = new Date(eve.data);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let startOfMonth = moment(firstDay).format('YYYY-MM-DD');
        let endOfMonth = moment(lastDay).format('YYYY-MM-DD');
        finalData = { "id": id, "schedule": "2", "roomBookingFromDate": startOfMonth, "roomBookingToDate": endOfMonth };

      }
    }
    this.roomBookingService.load_customfullcalendar_Data(finalData).subscribe(data => {
      let fullcalendar_data = JSON.parse(data['_body']);
      this.fullcalendar_ListData = fullcalendar_data.succesObject;
      let eventValue = [];
      for (let k = 0; k < this.fullcalendar_ListData.length; k++) {
        let val =
        {
          title: this.fullcalendar_ListData[k].roomBookingSubject,
          start: moment(this.fullcalendar_ListData[k].roomBookingFromDate).format('YYYY-MM-DD'),
          end: moment(this.fullcalendar_ListData[k].roomBookingToDate).format('YYYY-MM-DD'),
          from: this.fullcalendar_ListData[k].roomBookingFromTime,
          to: this.fullcalendar_ListData[k].roomBookingToTime,
        }
        eventValue.push(val);
      }
      this.calendarOptions = undefined;
      this.fullcalendar = undefined;

      this.calendarOptions = {
        editable: true,
        selectable: false,
        eventLimit: true,
        header: {
          left: 'today',
          center: 'prev, title, next',
          right: 'dayGridMonth,timeGridDay'
        },
        allDaySlot: false,
        views: {
          week: {
            eventLimit: 2,
          },
        },
        events: eventValue,

        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin]
      }
    });

  }
  clearLocations(){
    localStorage.removeItem('locationId');
    localStorage.removeItem('subLocationId');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/room-booking']));
  }
  clearForm() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/room-booking']));
  }


}

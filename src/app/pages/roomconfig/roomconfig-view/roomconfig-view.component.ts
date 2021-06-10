import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { RoomconfigViewService } from './roomconfig-view.service';
import { ComponentLoaderService } from '../../../shared/component-loader.service';

@Component({
  selector: 'app-roomconfig-view',
  templateUrl: './roomconfig-view.component.html',
  styleUrls: ['./roomconfig-view.component.css']
})

export class RoomconfigViewComponent implements OnInit {
  saveForm: FormGroup;
  count: number = 1;
  roomConfigScreenrow: number;
  RC_location_selectFormGetDate: any = [];
  RC_aminite_selectFormGetDate: any = [];
  RC_sublocation_selectFormGetDate: any = [];
  userBaseFieldName: any = [];
  subLocationListdept: any = [];
  priorityList: any[] = [
    {id:1, value: 'Low'},
    {id:2, value:'Medium'},
    {id:3, value:'High'}

  ];

  constructor(
     private formBuilder: FormBuilder,
     private RoomconfigViewService: RoomconfigViewService,
     private componentLoaderService: ComponentLoaderService 
  ) { }


  ngOnInit() {
    this.componentLoaderService.display(true);
    this.RC_list_modify();
    this.onloadSelectboxData();
    this.saveForm = this.formBuilder.group({
      rinRoomDetailConfigVoList: this.formBuilder.array([this.sequenceType()]),  // For Row Add and Remove
      roomConfigCode: ['', Validators.required],
      roomConfigRoomName: ['', Validators.required],
      roomConfigNoOfSeats: ['', Validators.required],
      id: ['', Validators.required],
      buildingName: [''],
      sublocationId : ['', Validators.required],
      isRoomConfigActive: [true],
      isRoomConfigApprovalRequired: [false, ],
      isRoomConfigUnderMaintenance: [false, ],
      fromDate : [null],
      toDate : [null],
      roomConfigPriorty:['', Validators.required]
    });
  }


  sequenceType() {
    return this.formBuilder.group({
      amenityId: ['', Validators.required],
      roomDetailNumberOfAmenities: ['', Validators.required],
      isRoomDetailConfigActive: [true, ],
    })
  }
  addSequence() {
    if (this.count <= 2) {
      (this.saveForm.controls['rinRoomDetailConfigVoList'] as FormArray).push(this.sequenceType());
      this.count++;
    }
  }
  deleteSequence() {
    if (this.count > 1) {
      (this.saveForm.controls['rinRoomDetailConfigVoList'] as FormArray).removeAt(-1);
      this.count--;
    }
  }


  RC_list_modify() {
    let rowId = localStorage.getItem('roomConfigId');
    this.RoomconfigViewService.load_modify_project(rowId).subscribe(data => {
      let RC_ModifyListGetData = JSON.parse(data['_body']);
      let RC_Modify_TableData = RC_ModifyListGetData.succesObject;

      this.userBaseFieldName = RC_ModifyListGetData.succesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );


        let loadSelectBoxList = this.RoomconfigViewService.load_subLocationselectBoxData(RC_Modify_TableData.id).subscribe(data => {
          let RC_selectGetData = JSON.parse(data['_body']);
          this.RC_sublocation_selectFormGetDate = RC_selectGetData.succesObject;
        }, error => {
          if(error.status === 401)
          {
            console.log(error);
          }
        });
      this.roomConfigScreenrow = RC_Modify_TableData.rinRoomDetailConfigVoList.length
      for(let i = 1; i < this.roomConfigScreenrow; i++){
        (this.saveForm.controls['rinRoomDetailConfigVoList'] as FormArray).push(this.sequenceType());
      }
      this.saveForm.patchValue(RC_ModifyListGetData.succesObject);
      if(RC_ModifyListGetData.succesObject.fromDate != null && RC_ModifyListGetData.succesObject.toDate != null){
        let x = new Date(RC_ModifyListGetData.succesObject.fromDate);
        let y = new Date(RC_ModifyListGetData.succesObject.toDate);
        this.saveForm.patchValue({fromDate : x, toDate : y});
        }
    }, error => {
      if(error.status === 401)
      {
        console.log(error);
      }
    })
    this.componentLoaderService.display(false);
}



onloadSelectboxData() {
  let loadSelectBoxList = this.RoomconfigViewService.load_rcselectBoxData().subscribe(data => {
    let RC_selectGetData = JSON.parse(data['_body']);
    this.RC_location_selectFormGetDate = RC_selectGetData.succesObject;
  }, error => {
    if(error.status === 401)
    {
      console.log(error);
    }
  });
  let roomConfigList = this.RoomconfigViewService.roomConfigDropdown().subscribe(data => {
    let RC_selectGetData = JSON.parse(data['_body']);
    this.RC_aminite_selectFormGetDate = RC_selectGetData.succesObject;
  }, error => {
    if(error.status === 401)
    {
      console.log(error);
    }
  });
}


subLocationDropDown(val) {
  let loadSelectBoxList = this.RoomconfigViewService.load_subLocationselectBoxData(val).subscribe(data => {
    let RC_selectGetData = JSON.parse(data['_body']);
    this.RC_sublocation_selectFormGetDate = RC_selectGetData.succesObject;
  }, error => {
    if(error.status === 401)
    {
      console.log(error);
    }
  });
  this.RoomconfigViewService.load_subLocationData(val).subscribe(
    data => {
      let resp = JSON.parse(data['_body']);
      this.subLocationListdept = resp.succesObject;
    },
    error => {
      console.log(error);
    }
  );
}





}

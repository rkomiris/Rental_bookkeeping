
import { Component, OnInit, Inject , ViewChild} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource,VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from "@angular/router";
import { RoomBookingService } from "../room-booking.service";
@Component({
  selector: 'app-roombook-detail',
  templateUrl: './roombook-detail.component.html',
  styleUrls: ['./roombook-detail.component.css']
})
export class RoombookDetailComponent implements OnInit {

  // constructor(@Inject(MAT_DIALOG_DATA) public data:any) { }
  detailsList : boolean = true;
  dataSource: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  approvalListFieldName : any = [];
  noRecord : boolean = false;
  pastRouter;
  constructor(private RoomBookingService: RoomBookingService, private dialogRef: MatDialogRef<RoombookDetailComponent>, private router: Router, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.pastRouter = this.router.url;
  }
currentusername: string;
  ngOnInit() {
   // userLoginId
    let kk = localStorage.getItem('userId');
    if ( kk !== null) {
      this.currentusername = kk;
      console.log(this.currentusername);
    }
  }

  btnPrjYes() {
    localStorage.setItem('isCancelled', 'No');
  }


  btnPrjNo() {
    localStorage.setItem('isCancelled', 'Yes');
  }
  cancelRoomBooking(id) {
    console.log(id);
    localStorage.setItem('roomBookingDetailsId', id);
  }
  cancelAllRoomBooking(id) {
    localStorage.setItem('cancelAllroomBookingId', id);
  }
  modifyRoomBooking(id, roomBookingId) {
    localStorage.setItem('modifyroomBookingDetailsId', id);
    localStorage.setItem('roomBookingId', roomBookingId);
  }
  statusList(id) {
    this.detailsList = false;
    this.RoomBookingService.approveStatusList(id).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      this.approvalListFieldName = ['userName','roomBookingWorkFlowAuditDescisionType','roomBookingWorkFlowAuditRemarks', 'approvedDate'];
      if(Response.succesObject.length >0){
      this.dataSource = new MatTableDataSource(Response.succesObject);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      }else{
        this.noRecord = true;
      }
    },
      error => {
        if (error.status === 401) {
          alert(error);
        }
      })
  }
  statusChange(){
    this.detailsList = true;
  }
}

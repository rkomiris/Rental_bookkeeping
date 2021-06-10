import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material';



@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.css']
})
export class TaskModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private dialogue:MatDialogRef<TaskModalComponent>) { }

  ngOnInit() {
  }
dialogueClose(){
  this.dialogue.close();
}
}

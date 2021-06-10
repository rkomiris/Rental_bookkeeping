import { SlaService } from './sla.service';
import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
@Component({
  selector: 'app-sla',
  templateUrl: './sla.component.html',
  styleUrls: ['./sla.component.css']
})
export class SlaComponent implements OnInit {
  applicaitonData:any;
  appobjlength:number;
  graphdata = [];
  multi: any[];

  view: any[] = [580, 170];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Status';
  showYAxisLabel = true;
  yAxisLabel = 'Count';
   single = [];
 
  colorScheme = {
    domain: ['#a9bf00', '#398235', '#ff9c02', '#ff4a36', '#8e7e7db3', '#de5400']
  }; // '#a9bf00', '#398235', '#ff9c02', '#ff4a36', '#8e7e7db3', '#de5400'


  onSelect(event) {
    
  }
  constructor(private appService: SlaService) {}

  ngOnInit() {


      this.appService.getWidgetData().subscribe(data => {
        let GetData = JSON.parse(data['_body']);
        this.applicaitonData = GetData.succesObject;
        this.single = [];
        this.colorScheme.domain = [];
        for (let i = 0; i < this.applicaitonData.length; i++) {
            if (this.applicaitonData[i].currentStatusId === 1) {
             this.colorScheme.domain.push('#8f8837');
              } else if (this.applicaitonData[i].currentStatusId === 3) {
                this.colorScheme.domain.push('#de5400');
              } else if (this.applicaitonData[i].currentStatusId === 11) {
                this.colorScheme.domain.push('#a9bf00');
              } else if (this.applicaitonData[i].currentStatusId === 5) {
                this.colorScheme.domain.push('#a99d9d');
              } else if (this.applicaitonData[i].currentStatusId === 10) {
                this.colorScheme.domain.push('#ff4a36');
              } else if (this.applicaitonData[i].currentStatusId === 2) {
                this.colorScheme.domain.push('#ff9c02');
              }
            this.single[i] = {value : this.applicaitonData[i].count, name : this.applicaitonData[i].status};

        }
      },
      error => {
        console.log(error);
      },
      );

  }

  

}


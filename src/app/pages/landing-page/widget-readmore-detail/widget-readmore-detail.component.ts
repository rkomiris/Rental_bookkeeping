import { LandingPageService } from './../landing-page.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { JsonApiService } from 'src/assets/api/json-api.service';



@Component({
  selector: 'app-widget-readmore-detail',
  templateUrl: './widget-readmore-detail.component.html',
  styleUrls: ['./widget-readmore-detail.component.css']
})
export class WidgetReadmoreDetailComponent implements OnInit {
  landingDetailWidgetData;
  widgetData;
  position:number;
  selectedItem;
  date:string;
  labels: any = {};

  constructor(private route: ActivatedRoute,
    private jsonApiService: JsonApiService,
    private location: Location,private service:LandingPageService) { }

  ngOnInit() {
    this.getLabelDetails();
    let date = this.route.snapshot.paramMap.get('date');

    this.service.selectDate_WidgetData(date).subscribe(data => {

     let postedData = JSON.parse(data['_body']);

    try{
     this.landingDetailWidgetData = postedData['successObject'];


    }catch(e){
     console.log('catched error',e);
    }


     },error=>{console.log(error)},
    ()=>{
    //on complete
    this.getWidgetFullDetails();
    })
  }
  getLabelDetails()
  {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }

  getWidgetFullDetails(){

    let id = +this.route.snapshot.paramMap.get('id');
    this.position = +this.route.snapshot.paramMap.get('position');

    this.date = this.route.snapshot.paramMap.get('date');
    this.widgetData = this.landingDetailWidgetData[this.position]['widgetDetailVoList'];

  }

  onSelectItem(item){
    this.selectedItem = item;
  }
  
  goBack(){
    this.location.back();
  }
}

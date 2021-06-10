import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-widget-more-detail',
  templateUrl: './widget-more-detail.component.html',
  styleUrls: ['./widget-more-detail.component.css']
})
export class WidgetMoreDetailComponent implements OnInit {
  @Input() widgetItem;
  constructor() { }

  ngOnInit() {
  }

}


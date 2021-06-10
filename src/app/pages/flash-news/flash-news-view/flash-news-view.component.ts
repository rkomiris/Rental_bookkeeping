import { Component, OnInit,OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashNewsViewService } from './flash-news-view.service';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-flash-news-view',
  templateUrl: './flash-news-view.component.html',
  styleUrls: ['./flash-news-view.component.css']
})
export class FlashNewsViewComponent implements OnInit {

  viewForm: FormGroup;
  userBaseFieldName: any = [];
  today = new Date();
  newsTypes: any = [];
  flashNewsViewListGetData: any = {};
  labels: any = {}; /** LABEL CHANGES **/

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private flashNewsViewService: FlashNewsViewService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private componentLoaderService: ComponentLoaderService) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.viewForm = this.formBuilder.group({
      flashNewsCode: ['', ],
      flashNewsType: ['',  ],
      flashNewsDate: ['',   ],
      flashNewsValidFrom: ['',  ],
      flashNewsValidTo: ['',  ],
      flashNewsDescription: ['',  ],
      isFlashNewsActive: ['', ],
    });
    if(localStorage.getItem('langCode') == 'en'){
      this.newsTypes=[
        {id: 1, name: 'Flash News'},
        {id: 2, name: 'Thought for the Day'},
      ];
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.newsTypes=[
        {id: 1, name: 'フラッシュニュー'},
        {id: 2, name: '毎日の思想'},
      ];
    }
    this.flashNews_list_view();
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

  flashNews_list_view() {
    
    let tempData = JSON.parse(window.localStorage.getItem('id'));
    this.flashNewsViewService.load_view_project(tempData).subscribe(data => {
      let flashNewsViewListGetData = JSON.parse(data['_body']);
      let flashNewsViewListTableData = flashNewsViewListGetData.succesObject;
      this.userBaseFieldName = flashNewsViewListGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      //this.viewForm.patchValue(flashNewsViewListTableData);
      this.viewForm.patchValue({flashNewsCode: flashNewsViewListTableData.flashNewsCode});
      this.viewForm.patchValue({flashNewsType: (flashNewsViewListTableData.flashNewsType)});
      this.viewForm.patchValue({flashNewsDate: moment(flashNewsViewListTableData.flashNewsDate).format('DD/MM/YYYY') });
      this.viewForm.patchValue({flashNewsValidFrom: moment(flashNewsViewListTableData.flashNewsValidFrom).format('DD/MM/YYYY') });
      this.viewForm.patchValue({flashNewsValidTo: moment(flashNewsViewListTableData.flashNewsValidTo).format('DD/MM/YYYY')});
      this.viewForm.patchValue({flashNewsDescription: flashNewsViewListTableData.flashNewsDescription});
      this.viewForm.patchValue({isFlashNewsActive: flashNewsViewListTableData.isFlashNewsActive});
      this.componentLoaderService.display(false);
      
      this.componentLoaderService.display(false);
    }, error => {
      if(error.status === 401)
      {
        console.log("Error");
      }
    
    })
  }
    ngOnDestroy()
    {
    localStorage.removeItem('requestTypeId');
    }
}








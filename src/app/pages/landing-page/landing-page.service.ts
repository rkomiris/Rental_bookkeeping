
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { environment} from '../../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {  tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {


  private URL = environment.API_HOST;
  constructor(private http: HttpClient, private myhttp: Http) { }


  getWidgetData() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'applicaiton/json',
        'Authorization' : `Bearer ${localStorage.getItem("access_token")}`
      })
     
    }
    return this.http.get(this.URL + '/Wid/getAll', httpOptions);
  }

  selectFromToDate_WidgetData(fromDate, ToDate): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
    let bodycontent = {
      "widgetDetailValidFrom": fromDate,
      "widgetDetailValidTo": ToDate
    }
    return this.myhttp.post(this.URL + "/Wid/date", bodycontent, headeroptions);
  }

  selectDate_WidgetData(data): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
    let bodycontent = {
      "widgetDetailAnnouncementDate": data,
    }
    // let bodycontent = JSON.stringify(data);
    return this.myhttp.post(this.URL + "/Wid/date", bodycontent, headeroptions);

  }

  load_flashNewsData(): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
   // let bodycontent = {};
    let data = {screenMaster: {screenId: 9}, subScreenMaster: {subScreenId: 17}};
    return this.myhttp.post(this.URL + '/flashNews/getAll', data, headeroptions );

  }

  download(id) {
    let screenOptions = {
      widgetDetailId: id
    };
    let headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("access_token")}`

    });
    
    let bodyoptions = screenOptions;
    return this.http.post(
        this.URL + "/Wid/attdownload",
        bodyoptions,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }
  
  load_holiday_Details():Observable<{}>{
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
    return this.myhttp.post(this.URL+"/holiday/getAllCalenderHoliday", {} , headeroptions);
  }

  load_holidayDetails(eventId):Observable<{}>{
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
    return this.myhttp.post(this.URL+"/holiday/view",{id : eventId, screenAuthorizationMaster:{ screenMaster: {	 "screenId": 25}, subScreenMaster:{ "subScreenId": 48}}}		       
    , headeroptions);
  }


  attDownloadFn(data) {
    let screenOptions = {
      widgetDetailId: Number(data)
    };
    let headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    });
    
    let bodyoptions = screenOptions;
    return this.http
      .post(
        this.URL + "/widget/attachmentDownload",
        bodyoptions,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }

}


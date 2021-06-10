
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { tap } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class WidgetsService {
  constructor(private http: Http, private httpClient: HttpClient) { }

  private URL: string = environment.API_HOST;

  load_widgetsData(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //headers.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = { screenId: 7 ,  subScreenId: 25 };
    return this.http.post(this.URL+"/Wid/getAll", data, headeroptions);
  }

  search_widget(obj: any): Observable<{}> {
    let headers = new Headers();
    let searchData = obj;
    headers.append('Content-Type', 'application/json');
    //  headers.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/Wid/search", searchData, headeroptions);
  }

  search_aminite(obj: any): Observable<{}> {
    let headers = new Headers();
    let searchData = obj;
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + '/Wid/search', searchData, headeroptions);
  }

  deleteProjectList(id): Observable<{}> {
    let headers = new Headers();
    //   headers.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let bodyoptions = {
      widgetsIdList: id
    };
    return this.http.post(this.URL+"/Wid/delete", bodyoptions, headeroptions);
  }
  getWidgetById(data) {
    let headers = new Headers();
    //headers.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    // let bodycontent = {
    //   widgetId: data
    //};
    let data1 = {screenJson: { screenId: 7 , subScreenId: 26 },
      widgetId: data
    };
    return this.http.post(this.URL+"/Wid/load", data1, headeroptions);
  }
  updateProjectList(data) {
    let headers = new Headers();
    //headers.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let bodycontent = data;
    return this.http.post(this.URL+"/Wid/update", bodycontent, headeroptions);
  }
  // deleteWidgets(data) {
  //   let headers = new Headers();
  //   // headers.append('Content-Type',undefined);
  //   headers.append('access_token', localStorage.getItem('access_token'));
  //   let headeroptions =new RequestOptions({ headers: headers});
  //   let bodycontent={
  //     widgetsIdList:data
  //   };
  //   return this.http.put(this.URL+'/Wid/delete', bodycontent, headeroptions);
  // }
  icoDownload(data) {
    let screenOptions = {
      widgetId: Number(data)
    };
    let headers = new HttpHeaders();
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);

    let bodyoptions = screenOptions;
    return this.httpClient
      .post(
        this.URL+"/Wid/download",
        bodyoptions,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }
  picDownload(data) {
    let screenOptions = {
      widgetDetailId: Number(data)
    };
    let headers = new HttpHeaders();
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let bodyoptions = screenOptions;
    return this.httpClient
      .post(
        this.URL+"/Wid/picdownload",
        bodyoptions,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }
  attDownload(data) {
    let screenOptions = {
      widgetDetailId: Number(data)
    };
    let headers = new HttpHeaders();
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let bodyoptions = screenOptions;
    return this.httpClient
      .post(
        this.URL+"/Wid/attdownload",
        bodyoptions,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }
  picDownloadFn(data) {
    let screenOptions = {
      widgetDetailId: Number(data)
    };
    let headers = new HttpHeaders();
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let bodyoptions = screenOptions;
    return this.httpClient
      .post(
        this.URL+"/widget/pictureDownload",
        bodyoptions,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }

  attDownloadFn(data) {
    let screenOptions = 
    {
      widgetDetailId: Number(data)
    };
    // let headers = new HttpHeaders();
    // let authToken = localStorage.getItem("access_token");
    // headers.append('Authorization', `Bearer ${authToken}`);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
    
    let bodyoptions = screenOptions;
    return this.httpClient
      .post(
        this.URL+"/widget/attachmentDownload",
        bodyoptions,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }

  indiviudalpicDownloadFn(data, picName) {
    let screenOptions = {
      widgetDetailId: Number(data),
      widgetDetailPicPath: picName
    };
    let headers = new HttpHeaders({
      access_token: localStorage.getItem("access_token")
    });
    let bodyoptions = screenOptions;
    return this.httpClient
      .get(
        this.URL+"/Wid/picdownload/" + picName,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }

  picDownloadWidgetIcon(data) {
    let screenOptions = {
      widgetId: Number(data)
    };
    // let headers = new HttpHeaders();
    // let authToken = localStorage.getItem("access_token");
    // headers.append('Authorization', `Bearer ${authToken}`);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    let bodyoptions = screenOptions;
    return this.httpClient
      .post(
        this.URL+"/Wid/download",
        bodyoptions,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }


  indiviudalattDownloadFn(data, picName) {
    let screenOptions = 
    {
      widgetDetailId: Number(data),
      widgetDetailAttPath: picName
    };
    let headers = new HttpHeaders();
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let bodyoptions = screenOptions;
    return this.httpClient
      .get(
        this.URL+"/Wid/attdownload/" + picName,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }
}


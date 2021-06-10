
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class RequesttypeModifyService {

  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;

  load_modify_project(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers});
    // let bodycontent ={
     // "requestTypeId": data,
    // }
    let data1 = { screenJson:  {screenId: 2,subScreenId: 6},
    requestTypeId: data};
    return this.http.post(this.URL+"/RT/load", data1, headeroptions);
  }

  update_modify_project(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));  
      let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent = Object.assign(data, {"requestTypeId" : Number(localStorage.getItem('requestTypeId'))});
    return this.http.post(this.URL+"/RT/update",bodycontent, headeroptions);
  }



}

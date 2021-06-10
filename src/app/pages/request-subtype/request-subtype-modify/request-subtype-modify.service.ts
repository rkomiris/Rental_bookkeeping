
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RequestSubtypeModifyService {

  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;

  load_modify_project(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let data1 = { screenJson: {screenId: 3, subScreenId: 16},
      requestSubTypeId: data
    };
    return this.http.post(this.URL+"/RST/load", data1, headeroptions);
  }

  update_modify_project(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
   let authToken = localStorage.getItem("access_token");
   headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent = Object.assign(data, {"requestSubTypeId" : Number(localStorage.getItem('requestSubTypeId'))});
    return this.http.post(this.URL+"/RST/update", bodycontent, headeroptions);
  }

  load_selectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    //headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/RT/dropdown", {}, headeroptions);
  }






}

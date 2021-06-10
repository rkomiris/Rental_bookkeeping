
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SublocationService {
  
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

  load_sublocation():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    //let data = {screenMaster: {screenId: 5}, subScreenMaster: {subScreenId: 7}};
    let data = {screenId:5,subScreenId:7};
    return this.http.post(this.URL+"/sub/getAll", data, headeroptions );
  }
  search_list(list):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/sub/search", list, headeroptions);
  }
  deleteProjectList(sublocationId):Observable<{}>{
    let headers = new Headers();
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={
      "deleteItem":sublocationId,
    }
    return this.http.post(this.URL+"/sub/delete",bodyoptions, headeroptions);
  }




}

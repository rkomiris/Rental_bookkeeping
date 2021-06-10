import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RequestWorkflowService {

  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;

  load_RWF_Data():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {screenId: 14, subScreenId: 29 };
    return this.http.post(this.URL+"/RWF/getAll", data, headeroptions );
  }




  search_list(list):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/RWF/search", list, headeroptions);
  }




  deleteProjectList(reqWorkFlowId):Observable<{}>{
    let headers = new Headers();
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={
      "requestWorkFlowList": reqWorkFlowId,
    }
    return this.http.post(this.URL+"/RWF/delete",bodyoptions, headeroptions);
  }





}

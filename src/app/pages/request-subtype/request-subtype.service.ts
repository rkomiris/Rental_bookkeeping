
import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RequestSubtypeService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  load_reqSubTypeData():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    //let data = {screenMaster: {screenId: 3}, subScreenMaster: {subScreenId: 15}};
    let data = {screenId:3,subScreenId:15};
    return this.http.post(this.URL+"/RST/getAll", data ,headeroptions );

  }
  search_list(list):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/RST/search", list, headeroptions);
  }
  deleteProjectList(requestSubTypeId):Observable<{}>{
    let headers = new Headers();
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={
      "requestSubTypeList":requestSubTypeId,
    }
    return this.http.post(this.URL+"/RST/delete",bodyoptions, headeroptions);
  }
}

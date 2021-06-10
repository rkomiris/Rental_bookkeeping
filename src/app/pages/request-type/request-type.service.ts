
import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RequestTypeService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  get_request_type():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {screenId: 2, subScreenId: 5};
    return this.http.post(this.URL+"/RT/getAll", data, headeroptions );
  }
  search_list(list):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/RT/search", list, headeroptions);
  }
  deleteProjectList(requestTypeId):Observable<{}>{
    let headers = new Headers();
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={  "requestTypeList":requestTypeId}
    return this.http.post(this.URL+"/RT/delete",bodyoptions, headeroptions);
  }








}

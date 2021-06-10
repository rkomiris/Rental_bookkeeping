import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForwardRequestService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  reqTypeId(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/RT/dropdown",{}, headeroptions);
  }
  getSubTypeList(val): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/RST/dropdown", {
      "requestTypeId": val
    }, headeroptions);
  }
  load_selectBox_LocationData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/locationLoad", {}, headeroptions);
  }
  load_selectBox_subLocationData(locationTypeId):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/sub/dropdown", {"id": locationTypeId}, headeroptions);
  }
  
  load_selectBox_departmentData( sublocationId, locationTypeId,): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    head.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: head });
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL + '/user/departmentLoad', { userLocation: locationTypeId, sublocationId : sublocationId }, headeroptions);
  }

  getSeqDepartment( sublocationId, locationTypeId,): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    head.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: head });
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL + '/user/departmentLoad', { userLocation: locationTypeId, sublocationId : sublocationId }, headeroptions);
  }
  submitReq(value, url):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+url, value, headeroptions);
  }
  screenlist(value):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+'/Req/screenlist', value, headeroptions);
  }
  screenDetails(reqType, reqSubType):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+'/screen/details', 
    {
      "requestTypeId": reqType,
      "requestSubtypeId": reqSubType
    }, headeroptions);
  }
}

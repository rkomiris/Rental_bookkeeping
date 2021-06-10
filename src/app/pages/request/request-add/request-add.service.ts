import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestAddService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  
  addProjectList(data):Observable<{}> {
    // let headers = new Headers();
    // headers.append('Content-Type','application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    // let headeroptions =new RequestOptions({ headers: headers});
    // let bodycontent=JSON.stringify(data);
    // return this.http.post(this.URL+"/Req/create",bodycontent, headeroptions);

    let headers = new Headers();
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent=JSON.stringify(data);
    return this.http.post(this.URL+'/Req/create',data, headeroptions);
    // return this.http.post(this.URL+'/Req/create',data, headeroptions);
  }

  getDropdownData():Observable<{}>
  {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
     let authToken = localStorage.getItem("access_token");
     header.append('Authorization', `Bearer ${authToken}`);
     header.append('userId',localStorage.getItem('userId'));
     let headeroptions = new RequestOptions({ headers: header });
    return this.http.post(this.URL+"/RT/dropdown",{}, headeroptions);
  }

  reqDeatailList(data):Observable<{}>{
    let header = new Headers();
    header.append('Content-Type', 'application/json');
     let authToken = localStorage.getItem("access_token");
     header.append('Authorization', `Bearer ${authToken}`);
     header.append('userId',localStorage.getItem('userId'));
     let headeroptions = new RequestOptions({ headers: header });
    let bodycontent=JSON.stringify(data);
    return this.http.post(this.URL+"/Req/screenlist",bodycontent, headeroptions);
  }
  load_selectBox_LocationData():Observable<{}>{
    let header = new Headers();
    header.append('Content-Type', 'application/json');
     let authToken = localStorage.getItem("access_token");
     header.append('Authorization', `Bearer ${authToken}`);
     header.append('userId',localStorage.getItem('userId'));
     let headeroptions = new RequestOptions({ headers: header });
    return this.http.post(this.URL+"/user/locationLoad", {}, headeroptions);
  }
  load_selectBox_subLocationData(locationTypeId):Observable<{}>{
    let header = new Headers();
    header.append('Content-Type', 'application/json');
     let authToken = localStorage.getItem("access_token");
     header.append('Authorization', `Bearer ${authToken}`);
     header.append('userId',localStorage.getItem('userId'));
     let headeroptions = new RequestOptions({ headers: header });
    return this.http.post(this.URL+"/sub/dropdown", {"id": locationTypeId}, headeroptions);
  }
  getreqtypeId(): Observable<{}> {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
     let authToken = localStorage.getItem("access_token");
     header.append('Authorization', `Bearer ${authToken}`);
     header.append('userId',localStorage.getItem('userId'));
     let headeroptions = new RequestOptions({ headers: header });
    return this.http.post(this.URL + "/RT/dropdown",{}, headeroptions);
  }
  getSubTypeList(val): Observable<{}> {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
     let authToken = localStorage.getItem("access_token");
     header.append('Authorization', `Bearer ${authToken}`);
     header.append('userId',localStorage.getItem('userId'));
     let headeroptions = new RequestOptions({ headers: header });
    return this.http.post(this.URL + "/RSTWF/dropdown", {
      "requestTypeId": val
    }, headeroptions);
  }
  deptId(): Observable<{}> {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
     let authToken = localStorage.getItem("access_token");
     header.append('Authorization', `Bearer ${authToken}`);
     header.append('userId',localStorage.getItem('userId'));
     let headeroptions = new RequestOptions({ headers: header });
    return this.http.post(this.URL + "/Req/vo",{}, headeroptions);
  }
  checkworkflow(data): Observable<{}> {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
     let authToken = localStorage.getItem("access_token");
     header.append('Authorization', `Bearer ${authToken}`);
     header.append('userId',localStorage.getItem('userId'));
     let headeroptions = new RequestOptions({ headers: header });
    let bodycontent = JSON.stringify(data);
    return this.http.post(this.URL + '/Req/workflow', bodycontent, headeroptions);
  }
  addscreen(): Observable<{}> {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
     let authToken = localStorage.getItem("access_token");
     header.append('Authorization', `Bearer ${authToken}`);
     header.append('userId',localStorage.getItem('userId'));
     let headeroptions = new RequestOptions({ headers: header });
    let data = {screenJson: {screenId: 18, subScreenId: 34}};
    return this.http.post(this.URL+"/Req/add", data,  headeroptions);
  }
  load_reqtypeList(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/RT/dropdown", {}, headeroptions);
  }
  load_selectBox_departmentData(val): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    head.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: head});
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL +"/user/departmentLoad", val, headeroptions);

  }
}

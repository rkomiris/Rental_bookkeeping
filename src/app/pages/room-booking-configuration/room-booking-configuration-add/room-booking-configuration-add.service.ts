import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomBookingConfigurationAddService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

  load_LocationData():Observable<{}>{ 
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/locationLoad", {}, headeroptions);
  }
  load_subLocationData(locationTypeId):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/sub/dropdown", {"id": locationTypeId}, headeroptions);
  }
  load_DepartmentselectBoxData():Observable<{}>{ 
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/departmentLoad", {}, headeroptions);
  }
  load_userRoleelectBoxData(data):Observable<{}>{ 
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/roleLoad", data,  headeroptions);
  }
  getUSer(id):Observable<{}>{   
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/dropdown", {"userRole": id}, headeroptions);
  }
  load_RoomConfigselectBoxData():Observable<{}>{ 
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/roomWorkFlow/configId", {}, headeroptions);
  }
  addProjectList(data):Observable<{}>{
    data.roomWorkFlowSlaVo = undefined;
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});    
    let bodycontent=JSON.stringify(data);
    return this.http.post(this.URL+"/roomWorkFlow/create",bodycontent , headeroptions);
  }




  // viewProjectList(data):Observable<{}>{
  //   let headers = new Headers();
  //   headers.append('Content-Type','application/json');
  //   headers.append('access_token', localStorage.getItem("access_token"));
  //   let headeroptions =new RequestOptions({ headers: headers});  
  //   return this.http.post(this.URL+"/roomWorkFlow/view",{roomWorkFlowId: data} , headeroptions);
  // }


  viewProjectList(data):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});  
    let bodycontent = {screenAuthorizationMaster:{screenMaster: {screenId: 17}, subScreenMaster: {subScreenId: 28}},
      roomWorkFlowId: data,
    };
    return this.http.post(this.URL+"/roomWorkFlow/view", bodycontent, headeroptions);
  }



  modifyProjectList(data):Observable<{}>{
    data.roomWorkFlowSlaVo = undefined;
    data.roomWorkFlowId = Number(localStorage.getItem('roomWorkFlowId'));
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});    
    
    return this.http.post(this.URL+"/roomworkflow/update",data , headeroptions);
  }


  addRoomBookingConfigDetails(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers});
    let data = {screenAuthorizationMaster: {screenMaster: {screenId: 17}, subScreenMaster: {subScreenId: 28}}};
    // let bodycontent = {screenAuthorizationMaster:{screenMaster: {screenId: 22}, subScreenMaster: {subScreenId: 38}},
    //   requestId: data,
    // };
    // let data = {screenMaster: {screenId: 16}, subScreenMaster: {subScreenId: 32}};
    return this.http.post(this.URL+"/roomWorkFlow/loadAdd", data,  headeroptions);
  }


  load_subLocation_selectBox_Data(locationTypeId): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    head.append('access_token', localStorage.getItem('access_token'));
    let headeroptions = new RequestOptions({ headers: head});
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL + '/user/departmentLoad', {userLocation: locationTypeId}, headeroptions);
  }

  load_selectBox_subLocationData(locationTypeId): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    head.append('access_token', localStorage.getItem('access_token'));
    let headeroptions = new RequestOptions({ headers: head});
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL + '/user/departmentLoad', {userLocation: locationTypeId}, headeroptions);
  }
}

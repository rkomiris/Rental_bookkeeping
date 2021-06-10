import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RoomconfigModifyService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;


  load_modify_project(rowId): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    // let bodycontent ={
    //   "roomConfigId": Number(rowId),
    //  } 
    let bodycontent = {screenAuthorizationMaster:{screenMaster: {screenId: 16}, subScreenMaster: {subScreenId: 32}},
      roomConfigId: Number(rowId),
    };
    return this.http.post(this.URL+"/RC/load",bodycontent, headeroptions);
  }



  update_modify_project(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent = Object.assign(data, {"roomConfigId" : Number(localStorage.getItem('roomConfigId'))});
    return this.http.post(this.URL+"/RC/update", bodycontent, headeroptions);
  }
  load_rcselectBoxData():Observable<{}>{  
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/locationLoad",	{												
    }                          
  , headeroptions);
  }
  roomConfigDropdown():Observable<{}>{  
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/RC/dropdown",{}, headeroptions);
  }


  load_subLocationselectBoxData(val):Observable<{}>{  
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/sub/dropdown",	{	id : val											
    }                          
  , headeroptions);
  }


  load_subLocationData(locationTypeId): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    head.append('access_token', localStorage.getItem('access_token'));
    let headeroptions = new RequestOptions({ headers: head});
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL + '/user/departmentLoad', {userLocation: locationTypeId}, headeroptions);
  }



}

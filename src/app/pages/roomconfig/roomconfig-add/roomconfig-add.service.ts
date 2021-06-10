import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomconfigAddService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  addProjectList(data):Observable<{}>{  
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent=JSON.stringify(data);
    return this.http.post(this.URL+"/RC/create",bodycontent, headeroptions);
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
    return this.http.post(this.URL+"/sub/dropdown",	{	id : val }, 
    headeroptions);
  }


  addRoomConfigDetails(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers});
    let data = {screenAuthorizationMaster: {screenMaster: {screenId: 16}, subScreenMaster: {subScreenId: 32}}};
    // let bodycontent = {screenAuthorizationMaster:{screenMaster: {screenId: 22}, subScreenMaster: {subScreenId: 38}},
    //   requestId: data,
    // };
    // let data = {screenMaster: {screenId: 16}, subScreenMaster: {subScreenId: 32}};
    return this.http.post(this.URL+"/RC/Add", data,  headeroptions);
  }



}

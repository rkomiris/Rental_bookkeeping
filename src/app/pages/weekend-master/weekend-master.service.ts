import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeekendMasterService {

  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

  weekendList():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {screenId:31,subScreenId:58};
    return this.http.post(this.URL+"/weekend/getAll", data, headeroptions );
  }

  addData():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data ={screenId: 31, subScreenId: 59};
    return this.http.post(this.URL+"/weekend/add", data, headeroptions );
  }

  viewData(viewId):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {'weekendId' : viewId,
    screenJson: {screenId: 31, subScreenId: 59}
  };
    return this.http.post(this.URL+"/weekend/view", data, headeroptions );
  }

  locationLoad():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/locationLoad",{}, headeroptions);
  }

  sublocationLoad(val):Observable<{}>
  {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/sub/dropdown",	{	id : val },headeroptions);
  }
  
  weekdayLoad():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/days/list",{}, headeroptions);
  }

  create(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL + '/weekend/create', data, headeroptions);
  }

  update(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL + '/weekend/update', data, headeroptions);
  }

  delete(weekendId):Observable<{}>{
    let headers = new Headers();
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={
      "deleteItem":weekendId,
    }
    return this.http.post(this.URL+"/weekend/delete",bodyoptions, headeroptions);
  }

  search(list):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/weekend/search", list, headeroptions);
  }
}

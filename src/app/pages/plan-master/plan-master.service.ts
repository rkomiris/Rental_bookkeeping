import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanMasterService {

  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

  planList():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {screenId:32,subScreenId:60};
    return this.http.post(this.URL+"/entityPlanningMaster/list", data, headeroptions );
  }

  addData():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data ={screenId: 32, subScreenId: 61};
    return this.http.post(this.URL+"/entityPlanningMaster/add", data, headeroptions );
  }

  viewData(viewId):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {'planId' : viewId,
    screenJson: {screenId: 32, subScreenId: 61}
  };
    return this.http.post(this.URL+"/entityPlanningMaster/view", data, headeroptions );
  }

  create(data): Observable<{}> {
    // let headers = new Headers();
    // headers.append('Content-Type','application/json');
    // let authToken = localStorage.getItem("access_token");
    // headers.append('Authorization', `Bearer ${authToken}`);
    // let headeroptions =new RequestOptions({ headers: headers});
    // return this.http.post(this.URL + '/entityPlanningMaster/save', data, headeroptions);

    let headers = new Headers();
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent=JSON.stringify(data);
    return this.http.post(this.URL+'/entityPlanningMaster/save',data, headeroptions);
  }

  update(data): Observable<{}> {
    // let headers = new Headers();
    // headers.append('Content-Type','application/json');
    // let authToken = localStorage.getItem("access_token");
    // headers.append('Authorization', `Bearer ${authToken}`);
    // let headeroptions =new RequestOptions({ headers: headers});
    // return this.http.post(this.URL + '/entityPlanningMaster/update', data, headeroptions);
    let headers = new Headers();
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent=JSON.stringify(data);
    return this.http.post(this.URL+'/entityPlanningMaster/update',data, headeroptions);
  }

  delete(planId):Observable<{}>{
    let headers = new Headers();
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={
      "deleteItem":planId,
    }
    return this.http.post(this.URL+"/entityPlanningMaster/delete",bodyoptions, headeroptions);
  }

  search(list):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/entityPlanningMaster/search", list, headeroptions);
  }

  currencyList():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/currency/dropdown", {}, headeroptions);
  }
}

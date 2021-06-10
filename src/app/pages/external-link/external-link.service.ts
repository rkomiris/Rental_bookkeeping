import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class ExternalLinkService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  load_exLinkData():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {screenId: 8, subScreenId: 13};
    return this.http.post(this.URL+"/externalLink/getAll", data, headeroptions );
  }

  search_list(list):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
     let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/externalLink/search", list, headeroptions);
  }

  deleteProjectList(id):Observable<{}>{
    let headers = new Headers();
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={
      "deleteItem":id,
    }
    return this.http.post(this.URL+"/externalLink/delete",bodyoptions, headeroptions);
  }




}


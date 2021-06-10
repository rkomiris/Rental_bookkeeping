import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

  load_sublocation():Observable<{}>{
   let heade = new Headers();
   heade.append('Content-Type', 'application/json');
   let authToken = localStorage.getItem("access_token");
   heade.append('Authorization', `Bearer ${authToken}`);
   let headeroptions = new RequestOptions({ headers: heade }); 
     let data = {screenId:4,subScreenId:35};
    return this.http.post(this.URL+"/loc/getAll", data, headeroptions );
  }
  search_list(list):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/loc/search", list, headeroptions);
  }
  deleteProjectList(locationId):Observable<{}>{
    let headers = new Headers();
    // headers.append('access_token', localStorage.getItem("access_token"));
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions =
    {
      "deleteItem":locationId,
    }
    return this.http.post(this.URL+"/loc/delete",bodyoptions, headeroptions);
  }
}

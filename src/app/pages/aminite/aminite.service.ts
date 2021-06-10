import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AminiteService {

  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;

  load_aminiteData():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {screenMaster: {screenId: 6}, subScreenMaster: {subScreenId: 3}};
    return this.http.post(this.URL+"/amenity/getAll", data, headeroptions );
  }

 search_list(list):Observable<{}>{
  let headers= new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('access_token', localStorage.getItem("access_token"));
  let headeroptions = new RequestOptions({ headers: headers });
  return this.http.post(this.URL+"/amenity/search", list, headeroptions);
}

  deleteProjectList(id):Observable<{}>{
    let headers = new Headers();
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={
      "amenityList":id,
    }
    return this.http.post(this.URL+"/amenity/delete",bodyoptions, headeroptions);
  }





}


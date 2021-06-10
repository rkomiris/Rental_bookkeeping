import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RoomconfigService {

  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;

  load_sublocation():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });   
    let data = {screenMaster: {screenId: 16}, subScreenMaster: {subScreenId: 31}};
    return this.http.post(this.URL+"/RC/getAll", data, headeroptions );   
  }
  deleteProjectList(roomConfigId):Observable<{}>{
    let headers = new Headers();
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={
      "roomConfigIdList":roomConfigId,
    } 
    return this.http.post(this.URL+"/RC/delete",bodyoptions, headeroptions);
  }
  search_list(list):Observable<{}>{
    let headers= new Headers();    	
    headers.append('Content-Type', 'application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });   
    return this.http.post(this.URL+"/RC/search", list, headeroptions);   
  }




}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomBookingConfigurationService {
  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;

  load_RBC_Data():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });  
    let data = {screenMaster: {screenId: 17}, subScreenMaster: {subScreenId: 27}}; 
    return this.http.post(this.URL+"/roomWorkFlow/getAll", data, headeroptions );
  }


  search_list(list):Observable<{}>{
    let headers= new Headers();    	
    headers.append('Content-Type', 'application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });   
    return this.http.post(this.URL+"/roomWorkFlow/search", list, headeroptions);   
  }

  deleteProjectList(roomconfigId):Observable<{}>{
    let headers = new Headers();
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={
      "deleteItem": roomconfigId,
    } 
    return this.http.post(this.URL+"/roomWorkFlow/delete",bodyoptions, headeroptions);
  }

}

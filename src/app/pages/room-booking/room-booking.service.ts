
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RoomBookingService {


  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;
  load_roomBookList_DataLocation(data):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/roomBooking/getAll", data , headeroptions);
  }
  load_roomBookList_Data():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/roomBooking/getAll", {}, headeroptions);
  }
  add_newRoom_booking(data):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/roomBooking/create",data, headeroptions);
  }
  update_newRoom_booking(data):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/roomBooking/update",data, headeroptions);
  }


  load_selectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/locationLoad", {}, headeroptions);
  }
  load_selectBox_subLocationData(locationTypeId):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/sub/dropdown", {"id": locationTypeId}, headeroptions);
  }
  load_selectBox_roomConfigData(subLocationTypeId):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/roomBooking/roomconfig", {"sublocationId": subLocationTypeId}, headeroptions);
  }
  load_fullcalendar_Data(data):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });
    let data1 = { screenAuthorizationMaster: {screenMaster: {screenId: 20}, subScreenMaster: {subScreenId: 41}}};
    Object.assign(data1, data);
    return this.http.post(this.URL+"/roomBooking/loadAll", data1, headeroptions );

  }
  locations_load_fullcalendar_Data(data):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });
    let data1 = { screenAuthorizationMaster: {screenMaster: {screenId: 20}, subScreenMaster: {subScreenId: 41}}};
    Object.assign(data1, data);
    return this.http.post(this.URL+"/roomBooking/loadAll", data1, headeroptions );

  }
  load_fullcalendar_Dataserch(dd): Observable<{}> {
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });
   // let data1 = { screenAuthorizationMaster: {screenMaster: {screenId: 20}, subScreenMaster: {subScreenId: 41}}};
    return this.http.post(this.URL+"/roomBooking/loadAllSearch", dd , headeroptions );

  }
  load_customfullcalendar_Data(data):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });
    let data1 = { screenAuthorizationMaster: {screenMaster: {screenId: 20}, subScreenMaster: {subScreenId: 41}}};
    return this.http.post(this.URL+"/roomBooking/loadAll", data1, headeroptions );

  }
  fullcalendar_search_Data(roomConfigTypeId):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/roomBooking/search", {"roomConfigId": roomConfigTypeId}, headeroptions);
  }

  loadFacilities_Data(id):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/roomBooking/load", {"roomConfigId": id}, headeroptions);
  }


  load_modify_eventData(eventSeq): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent = {
      "roomBookingId": eventSeq,
    }
    return this.http.post(this.URL+"/roomBooking/view",bodycontent, headeroptions);
  }
  deleteEventList(data):Observable<{}>{
    let headers = new Headers();
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={
      "idList":[data],
    }
    return this.http.post(this.URL+"/roomBooking/delete",bodyoptions, headeroptions);
  }
  deleteAllEventList(data):Observable<{}>{
    let headers = new Headers();
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={
      "roomBookingId":data,
    }
    return this.http.post(this.URL+"/roomBooking/deleteAll",bodyoptions, headeroptions);
  }
  viewEvent(data):Observable<{}>{
    let headers = new Headers();
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={
      "roomBookingDetailsId":data,
    }
    return this.http.post(this.URL+"/roomBooking/view",bodyoptions, headeroptions);
  }

  approveStatusList(data):Observable<{}>{
    let headers = new Headers();
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodyoptions ={
      "roomBookingId":data,
    }
    return this.http.post(this.URL+"/roomBooking/approveStatus",bodyoptions, headeroptions);
  }


}

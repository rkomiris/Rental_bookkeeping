import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RequestWorkflowViewService {

  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;

  load_view_project(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));    
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent ={
      "reqWorkFlowId": data,
     } 
    return this.http.post(this.URL+"/RWF/load",bodycontent, headeroptions);
  }

load_roomBookList_Data():Observable<{}>{
  let headers = new Headers();
  headers.append('Content-Type','application/json');
  headers.append('access_token', localStorage.getItem("access_token"));
  headers.append('userId',localStorage.getItem('userId'));

  let headeroptions =new RequestOptions({ headers: headers});
  
  return this.http.post(this.URL+"/roombooking/dropdown", {}, headeroptions);
}






load_selectBox_subTypeData(typeid):Observable<{}>{ 
  let headers = new Headers();
  headers.append('Content-Type','application/json');
  headers.append('access_token', localStorage.getItem("access_token"));
  headers.append('userId',localStorage.getItem('userId'));

  let headeroptions =new RequestOptions({ headers: headers});

  return this.http.post(this.URL+"/RST/dropdown", {"requestTypeId": typeid}, headeroptions);
}

load_selectBoxData():Observable<{}>{  
  let headers = new Headers();
  headers.append('Content-Type','application/json');
  headers.append('access_token', localStorage.getItem("access_token"));
  headers.append('userId',localStorage.getItem('userId'));

  let headeroptions =new RequestOptions({ headers: headers});
  return this.http.post(this.URL+"/RWF/dropdown", {}, headeroptions);
}



load_selectBox_subLocationData(locationTypeId):Observable<{}>{
  let headers = new Headers();
  headers.append('Content-Type','application/json');
  headers.append('userId',localStorage.getItem('userId'));
  headers.append('access_token', localStorage.getItem("access_token"));

  let headeroptions =new RequestOptions({ headers: headers});
  return this.http.post(this.URL+"/sub/dropdown", {"id": locationTypeId}, headeroptions);
}






load_selectBoxData_executer():Observable<{}>{   
  let headers = new Headers();
  headers.append('Content-Type','application/json');
  headers.append('access_token', localStorage.getItem("access_token"));
  headers.append('userId',localStorage.getItem('userId'));

  let headeroptions =new RequestOptions({ headers: headers});
  return this.http.post(this.URL+"/RWF/executerDropdown", {}, headeroptions);
}


load_selectBox_subLocationData_executer (exLocationTypeId):Observable<{}>{   
  let headers = new Headers();
  headers.append('Content-Type','application/json');
  headers.append('access_token', localStorage.getItem("access_token"));
  headers.append('userId',localStorage.getItem('userId'));

  let headeroptions =new RequestOptions({ headers: headers});

  return this.http.post(this.URL+"/sub/executerDropdown", {"id": exLocationTypeId}, headeroptions);
}







load_selectBoxData_sequence():Observable<{}>{   
  let headers = new Headers();
  headers.append('Content-Type','application/json');
  headers.append('access_token', localStorage.getItem("access_token"));
  headers.append('userId',localStorage.getItem('userId'));

  let headeroptions =new RequestOptions({ headers: headers});
  return this.http.post(this.URL+"/RWF/sequenceDropdown", {}, headeroptions);
}


load_selectBox_subLocationData_sequence (seqLocationTypeId):Observable<{}>{ 
  let headers = new Headers();
  headers.append('Content-Type','application/json');
  headers.append('access_token', localStorage.getItem("access_token"));
  headers.append('userId',localStorage.getItem('userId'));
  let headeroptions =new RequestOptions({ headers: headers});
  return this.http.post(this.URL+"/sub/sequenceDropdown", {"id": seqLocationTypeId}, headeroptions);
}






}

import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { Observable , of }from 'rxjs';
import { delay }from 'rxjs/operators';
import { HttpClient, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import { baseURL}from '../shared/baseurl';
import { map, catchError }from 'rxjs/operators';
import { ProcessHTTPMsgService}from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http:HttpClient,
    private processHTTPMsgservice:ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]> {
     return this.http.get<Leader[]>(baseURL + 'leaders')
     .pipe(catchError(this.processHTTPMsgservice.handleError));
     }


  getLeader(id:string):Observable<Leader>{
  return this.http.get<Leader>(baseURL + 'leaders/' + id)
  .pipe(catchError(this.processHTTPMsgservice.handleError));
    }


  getFeaturedLeader():Observable<Leader>{
    return  this.http.get<Leader>(baseURL + 'leaders?featured=true')
    .pipe(map(leaders => leaders[0]))
    .pipe(catchError(this.processHTTPMsgservice.handleError));
    }


 getLeaderIds():Observable<string[] | any> {
   return this.getLeaders().pipe(map(leaders => leaders.map(leader => leader.id)))
   .pipe(catchError(error => error));
 }

 putLeader(leader:Leader):Observable<Leader>{
   const httpOptions= {
     headers: new HttpHeaders({
       'comment-type': 'application/json'
     })
   };

   return this.http.put<Leader>(baseURL + 'leaders/' + leader.id,leader,httpOptions)
   .pipe(catchError(this.processHTTPMsgservice.handleError));
 }

}

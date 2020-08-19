import { Injectable } from '@angular/core';
import { Dish} from '../shared/dish';
import { HttpClient, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import { baseURL}from '../shared/baseurl';
import { Observable ,of }from 'rxjs';
import { delay }from 'rxjs/operators';
import { map, catchError }from 'rxjs/operators';
import { ProcessHTTPMsgService}from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http:HttpClient,
    private processHTTPMsgservice:ProcessHTTPMsgService) { }

  getDishes(): Observable<Dish[]> {
     return this.http.get<Dish[]>(baseURL + 'dishes')
     .pipe(catchError(this.processHTTPMsgservice.handleError));
     }


  getDish(id:string):Observable<Dish>{
  return this.http.get<Dish>(baseURL + 'dishes/' + id)
  .pipe(catchError(this.processHTTPMsgservice.handleError));
    }


  getFeaturedDish():Observable<Dish>{
    return  this.http.get<Dish>(baseURL + 'dishes?featured=true')
    .pipe(map(dishes => dishes[0]))
    .pipe(catchError(this.processHTTPMsgservice.handleError));
    }


 getDishIds():Observable<string[] | any> {
   return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id)))
   .pipe(catchError(error => error));
 }

 putDish(dish:Dish):Observable<Dish>{
   const httpOptions= {
     headers: new HttpHeaders({
       'comment-type': 'application/json'
     })
   };

   return this.http.put<Dish>(baseURL + 'dishes/' + dish.id,dish,httpOptions)
   .pipe(catchError(this.processHTTPMsgservice.handleError));
 }

}

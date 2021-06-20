import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Iproducts } from './products';
import { Observable, of, throwError } from 'rxjs';
import {catchError, map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _url = "http://localhost:9000/api/v1";

  constructor( private http: HttpClient) { }

  getProducts() : Observable<Iproducts[]>{
    return this.http.get<Iproducts[]>(this._url).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err.message);
        return throwError(err.message || "Server Error");
      })
    );
  }

  addProducts(product : Iproducts) : Observable<Iproducts>{
    return this.http.post<Iproducts>(this._url,product,{
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err.message);
        return throwError(err.message || "Server Error");
      })
    )
  }

  updateProducts(product : Iproducts) : Observable<Iproducts>{
    return this.http.put<Iproducts>(this._url,product,{
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err.message);
        return throwError(err.message || "Server Error");
      })
    );
  }

  deleteProducts(id : string) : Observable<any>{
    return this.http.delete<any>(this._url+"/"+id).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err.message);
        return throwError(err.message || "Server Error");
      })
    );
  }
}

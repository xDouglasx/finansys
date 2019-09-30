import { BaseResourceModel } from '../models/base-resource.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError, flatMap } from "rxjs/operators";

export abstract class BaseResourceService<T extends BaseResourceModel>{
    
  private apiPath: string = "api/categories";

  constructor(private http: HttpClient) { }

  getAll(): Observable<T[]>{
    return this.http.get(this.apiPath).pipe(catchError(this.handleError), map(this.jsonDataToCategories))
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(catchError(this.handleError), map(this.jsonDataToT));
  }

  create(category: T): Observable<T> {
    return this.http.post(this.apiPath, category).pipe(catchError(this.handleError), map(this.jsonDataToT));
  }

  update(category: T): Observable<T> {
    const url = `${this.apiPath}/${category.id}`;
    return this.http.put(url, category).pipe(catchError(this.handleError), map(() => category));
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }
}
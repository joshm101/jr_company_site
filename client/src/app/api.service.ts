import { Injectable } from '@angular/core';
import { 
  HttpResponse, HttpClient, 
  HttpHeaders, HttpParams 
} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

type OptionsType = {
  params?: {
    key: any,
    value: any,
  }[],
  headers?: {
    key: any,
    value: any,
  }[],
}

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  get(
    url: string, 
    options?: OptionsType
  ) {
    const params = this.constructSearchParams(options);
    const requestOptions = {
      params,
    }
    return this.http.get(url, requestOptions);
  }

  post(
    url: string,
    body: any,
    options?: OptionsType
  ) {
    const params = this.constructSearchParams(options);
    const headers = this.constructHeaders(options);
    const requestOptions = {
      params,
      headers,
    };
    return this.http.post(url, body, requestOptions);
  }

  put(
    url: string,
    body: any,
    options?: OptionsType
  ) {
    const params = this.constructSearchParams(options);
    const headers = this.constructHeaders(options);
    const requestOptions = {
      params,
      headers,
    };
    return this.http.put(url, body, requestOptions);
  }

  delete(
    url: string,
    options?: OptionsType
  ) {
    const params = this.constructSearchParams(options);
    const headers = this.constructHeaders(options);
    const requestOptions = {
      params,
      headers,
    };
    return this.http.delete(url, requestOptions);
  }

  /**
   * Constructs HttpClient request headers for an Angular
   * HTTP request
   * @param options object containing array of header key,value objects
   * @return { HttpHeaders } headers for an HttpClient request
   */
  private constructHeaders(options: OptionsType) {
    if (!options || !options.headers) {
      return new HttpHeaders();
    }
    let headers = new HttpHeaders();
    options.headers.forEach(header => {
      headers = headers.append(
        header.key, 
        header.value
      );
    });
    return headers;
  }

  /**
   * Constructs HttpClient request URL params for an Angular
   * HTTP request
   * @param options object containing array of parameters
   * @return { HttpParams } params for an HttpClient request
   */
  private constructSearchParams(options: OptionsType) {
    if (!options || !options.params) {
      return new HttpParams();
    }
    let params = new HttpParams();
    options.params.forEach(param => {
      params = params.append(param.key, param.value);
    });

    return params;
  }

  public handleError(error: any): Observable<any> {
    return Observable.throw(
      this.constructErrorMessageString(error)
    );
  }

  private constructErrorMessageString(error: any) {
    if (!(error instanceof HttpResponse)) {
      return error.message ? 
      error.message : 
      { error: error.toString() };
    }
    const body = error.body || '';
    const err = body.error || JSON.stringify(body);
    return `${error.status} - ${error.statusText || ''} ${err}`;
  }

}

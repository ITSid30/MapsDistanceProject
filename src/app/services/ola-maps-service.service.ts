import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OlaMapsServiceService {

  private OlaApiKey = '';
  private apiUrl = 'https://api.ola.maps/v1/directions/driving';

  constructor(private http: HttpClient) {}

  getRoute(from: [number, number], to: [number, number]): Observable<any> {
    const url = `${this.apiUrl}?origin=${from.join(',')}&destination=${to.join(',')}&api_key=${this.OlaApiKey}`;
    return this.http.get(url);
  }
}

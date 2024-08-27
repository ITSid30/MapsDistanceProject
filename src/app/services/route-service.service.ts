import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private apiKey = '';
  private apiUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';

  constructor(private http: HttpClient) {}

  getRoute(coords: [number, number][]): Observable<any> {
    const body = {
      coordinates: coords.map(coord => [coord[1], coord[0]]), // Ensure coords are [longitude, latitude]
      format: 'geojson'
    };

    const headers = new HttpHeaders({
      'Authorization': this.apiKey,
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, body, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching route:', error);
        return throwError(error);
      })
    );
  }
}
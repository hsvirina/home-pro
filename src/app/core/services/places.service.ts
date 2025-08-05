import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Place } from '../models/place.model';
import { API_ENDPOINTS } from '../../environments/api-endpoints';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private readonly baseUrl = API_ENDPOINTS.places.list;

  constructor(private http: HttpClient) {}

  getPlaces(lang: string = 'en'): Observable<Place[]> {
    const params = new HttpParams().set('lang', lang);
    return this.http.get<Place[]>(this.baseUrl, { params });
  }
}

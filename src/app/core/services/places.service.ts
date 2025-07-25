import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Place } from '../models/place.model';
import { API_ENDPOINTS } from '../../environments/api-endpoints';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private readonly baseUrl = API_ENDPOINTS.places.list;

  constructor(private http: HttpClient) {}

  getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(this.baseUrl);
  }
}
